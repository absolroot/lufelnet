import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3131;

// _dev/article-editor 기준으로 리포 루트 계산
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const POSTS_DIR = path.join(ROOT, "_posts");
const ASSET_ROOT = path.join(ROOT, "apps", "article", "asset");

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/apps/article/asset", express.static(ASSET_ROOT));

// 업로드는 메모리로 받고 직접 파일로 저장 (원하는 경로에)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

function safeSlug(input) {
  return slugify(String(input || ""), {
    lower: true,
    strict: true,
    trim: true
  }) || "untitled";
}

function toKSTFrontMatterDate(input) {
  // input: "2026-01-12" 또는 "2026-01-12T13:00"
  // 출력: "2026-01-12 00:00:00 +0900" 같은 형태
  const s = String(input || "").trim();
  if (!s) {
    // 기본값: 오늘 00:00:00 +0900 (서버 로컬시간 가정)
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} 00:00:00 +0900`;
  }

  const [datePart, timePartRaw] = s.split("T");
  const timePart = (timePartRaw || "00:00").slice(0, 5);
  return `${datePart} ${timePart}:00 +0900`;
}

function yamlQuote(v) {
  const s = String(v ?? "");
  // 큰따옴표 감싸고 내부 큰따옴표 이스케이프
  return `"${s.replaceAll('"', '\\"')}"`;
}

function yamlInlineList(values) {
  const arr = (values || [])
    .map((x) => String(x).trim())
    .filter(Boolean);
  if (arr.length === 0) return "[]";
  return `[${arr.map((x) => x.includes(" ") ? yamlQuote(x) : x).join(", ")}]`;
}

function buildPostMarkdown(payload) {
  const slug = safeSlug(payload.slug);
  const dateFM = toKSTFrontMatterDate(payload.date);
  const titleKr = payload.titleKr?.trim() || "Untitled";
  const titleEn = payload.titleEn?.trim() || titleKr;
  const titleJp = payload.titleJp?.trim() || titleKr;

  const author = payload.author?.trim() || "AbsolRoot";
  const categories = Array.isArray(payload.categories) ? payload.categories : ["Guide"];
  const tags = Array.isArray(payload.tags) ? payload.tags : ["guide"];

  const description = (payload.description || "").trim();
  const thumbnail = (payload.thumbnail || "").trim();
  const image = (payload.image || thumbnail).trim();

  const kr = (payload.contentKr || "").trim();
  const en = (payload.contentEn || "").trim();
  const jp = (payload.contentJp || "").trim();

  const fmLines = [
    "---",
    "layout: article",
    `title: ${yamlQuote(titleKr)}`,
    `date: ${dateFM}`,
    `categories: ${yamlInlineList(categories)}`,
    `tags: ${yamlInlineList(tags)}`,
    `author: ${author}`,
  ];

  if (thumbnail) fmLines.push(`thumbnail: ${thumbnail}`);
  if (image) fmLines.push(`image: ${image}`);
  if (description) fmLines.push(`description: ${yamlQuote(description)}`);

  fmLines.push(
    "translations:",
    "  kr:",
    `    title: ${yamlQuote(titleKr)}`,
    "  en:",
    `    title: ${yamlQuote(titleEn)}`,
    "  jp:",
    `    title: ${yamlQuote(titleJp)}`,
    "---",
    "",
    `<div class="content-kr" markdown="1">`,
    "",
    kr,
    "",
    "</div>",
    "",
    `<div class="content-en" markdown="1">`,
    "",
    en,
    "",
    "</div>",
    "",
    `<div class="content-jp" markdown="1">`,
    "",
    jp,
    "",
    "</div>",
    ""
  );

  return { slug, dateFM, markdown: fmLines.join("\n") };
}

function fromKSTFrontMatterDate(value) {
  const s = String(value || "").trim();
  const match = s.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
  if (!match) return "";
  return `${match[1]}T${match[2]}`;
}

function unquote(value) {
  const s = String(value || "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return s;
}

function parseInlineList(value) {
  const s = String(value || "").trim();
  if (!s || s === "[]") return [];
  if (!s.startsWith("[")) return [unquote(s)];
  const inner = s.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map((v) => unquote(v.trim())).filter(Boolean);
}

function extractContentBlock(body, className) {
  const re = new RegExp(`<div\\s+class="${className}"\\s+markdown="1">([\\s\\S]*?)<\\/div>`, "i");
  const match = body.match(re);
  return match ? match[1].trim() : "";
}

function slugFromFilename(filename) {
  const base = path.basename(filename, ".md");
  const parts = base.split("-");
  if (parts.length <= 3) return base;
  return parts.slice(3).join("-");
}

function parsePostMarkdown(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  const fmText = match ? match[1] : "";
  const body = match ? markdown.slice(match[0].length) : markdown;

  const fmLines = fmText.split(/\r?\n/);
  const data = {
    titleKr: "",
    titleEn: "",
    titleJp: "",
    dateFM: "",
    author: "",
    categories: [],
    tags: [],
    description: "",
    thumbnail: "",
    image: "",
    contentKr: extractContentBlock(body, "content-kr"),
    contentEn: extractContentBlock(body, "content-en"),
    contentJp: extractContentBlock(body, "content-jp")
  };

  let inTranslations = false;
  let currentLang = "";

  for (const line of fmLines) {
    if (!line) continue;

    if (line.startsWith("translations:")) {
      inTranslations = true;
      currentLang = "";
      continue;
    }

    const langMatch = line.match(/^\s{2}(kr|en|jp):\s*$/);
    if (langMatch) {
      currentLang = langMatch[1];
      continue;
    }

    const titleMatch = line.match(/^\s{4}title:\s*(.+)$/);
    if (inTranslations && currentLang && titleMatch) {
      const title = unquote(titleMatch[1]);
      if (currentLang === "kr") data.titleKr = title;
      if (currentLang === "en") data.titleEn = title;
      if (currentLang === "jp") data.titleJp = title;
      continue;
    }

    if (inTranslations && !line.startsWith(" ")) {
      inTranslations = false;
      currentLang = "";
    }

    const matchLine = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
    if (!matchLine) continue;
    const key = matchLine[1];
    const value = matchLine[2];

    switch (key) {
      case "title":
        data.titleKr = data.titleKr || unquote(value);
        break;
      case "date":
        data.dateFM = value.trim();
        break;
      case "author":
        data.author = unquote(value);
        break;
      case "categories":
        data.categories = parseInlineList(value);
        break;
      case "tags":
        data.tags = parseInlineList(value);
        break;
      case "description":
        data.description = unquote(value);
        break;
      case "thumbnail":
        data.thumbnail = value.trim();
        break;
      case "image":
        data.image = value.trim();
        break;
      default:
        break;
    }
  }

  return data;
}

function datePrefixFromFM(dateFM) {
  // "YYYY-MM-DD HH:MM:SS +0900" -> "YYYY-MM-DD"
  return String(dateFM).slice(0, 10);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function uniquePath(dir, filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = filename;
  let i = 1;
  while (await fileExists(path.join(dir, candidate))) {
    candidate = `${base}-${i}${ext}`;
    i += 1;
  }
  return path.join(dir, candidate);
}

async function findPostFile({ filename, slug }) {
  if (filename) {
    let safeName = path.basename(String(filename).trim());
    if (!safeName.toLowerCase().endsWith(".md")) safeName += ".md";
    const fullPath = path.join(POSTS_DIR, safeName);
    if (await fileExists(fullPath)) return { fullPath, filename: safeName };
    return null;
  }

  const slugValue = String(slug || "").trim().toLowerCase();
  if (!slugValue) return null;

  const entries = await fs.readdir(POSTS_DIR);
  const matches = entries.filter((name) => name.toLowerCase().endsWith(`-${slugValue}.md`));
  if (matches.length === 0) return null;
  matches.sort();
  const filenameFound = matches[matches.length - 1];
  return { fullPath: path.join(POSTS_DIR, filenameFound), filename: filenameFound };
}

// 이미지 업로드 (Toast UI hook 포함)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const slug = safeSlug(req.body.slug || "untitled");
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname) || ".png";
    const base = path.basename(req.file.originalname, ext);

    const safeBase = slugify(base, { lower: true, strict: true, trim: true }) || "image";
    const filename = `${safeBase}${ext.toLowerCase()}`;

    const dir = path.join(ASSET_ROOT, slug);
    await ensureDir(dir);

    const fullPath = await uniquePath(dir, filename);
    await fs.writeFile(fullPath, req.file.buffer);

    const rel = `/apps/article/asset/${slug}/${path.basename(fullPath)}`;
    res.json({ url: rel });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Upload failed" });
  }
});

// 포스트 저장 (단일 md 파일 생성)
app.post("/api/save", async (req, res) => {
  try {
    const payload = req.body || {};
    const { slug, dateFM, markdown } = buildPostMarkdown(payload);

    await ensureDir(POSTS_DIR);

    const datePrefix = datePrefixFromFM(dateFM);
    const filename = `${datePrefix}-${slug}.md`;
    const fullPath = path.join(POSTS_DIR, filename);

    await fs.writeFile(fullPath, markdown, "utf8");

    res.json({
      ok: true,
      file: fullPath,
      postFilename: filename,
      assetDir: path.join(ASSET_ROOT, slug),
      slug,
      postUrl: `/article/${slug}/`,
      dateFM
    });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Save failed" });
  }
});

// Load existing post
app.get("/api/post", async (req, res) => {
  try {
    const { filename, slug } = req.query;
    const found = await findPostFile({ filename, slug });
    if (!found) return res.status(404).json({ error: "Post not found" });

    const raw = await fs.readFile(found.fullPath, "utf8");
    const parsed = parsePostMarkdown(raw);
    const derivedSlug = slugFromFilename(found.filename);
    const datePrefix = found.filename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1] || "";
    const dateLocal = parsed.dateFM ? fromKSTFrontMatterDate(parsed.dateFM) : (datePrefix ? `${datePrefix}T00:00` : "");

    res.json({
      ok: true,
      postFilename: found.filename,
      slug: derivedSlug,
      postUrl: `/article/${derivedSlug}/`,
      dateLocal,
      author: parsed.author,
      categories: parsed.categories,
      tags: parsed.tags,
      description: parsed.description,
      thumbnail: parsed.thumbnail,
      image: parsed.image,
      titleKr: parsed.titleKr,
      titleEn: parsed.titleEn || parsed.titleKr,
      titleJp: parsed.titleJp || parsed.titleKr,
      contentKr: parsed.contentKr,
      contentEn: parsed.contentEn,
      contentJp: parsed.contentJp
    });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Load failed" });
  }
});

// List posts for dropdown
app.get("/api/posts", async (req, res) => {
  try {
    let entries = [];
    try {
      entries = await fs.readdir(POSTS_DIR);
    } catch {
      entries = [];
    }

    const posts = [];
    for (const name of entries) {
      if (!name.toLowerCase().endsWith(".md")) continue;
      const fullPath = path.join(POSTS_DIR, name);
      try {
        const raw = await fs.readFile(fullPath, "utf8");
        const parsed = parsePostMarkdown(raw);
        const slug = slugFromFilename(name);
        const title = parsed.titleKr || slug;
        const datePrefix = name.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1] || "";
        posts.push({ filename: name, slug, title, datePrefix });
      } catch {
        continue;
      }
    }

    posts.sort((a, b) => (a.filename < b.filename ? 1 : -1));

    res.json({ ok: true, posts });
  } catch (e) {
    res.status(500).json({ error: e?.message || "List failed" });
  }
});

// Delete uploaded image when removed from editor
app.post("/api/delete-image", async (req, res) => {
  try {
    const url = String(req.body?.url || "").trim();
    if (!url) return res.status(400).json({ error: "Missing url" });

    const safePath = new URL(url, "http://localhost").pathname;
    if (!safePath.startsWith("/apps/article/asset/")) {
      return res.status(400).json({ error: "Invalid path" });
    }

    const rel = safePath.replace("/apps/article/asset/", "");
    const fullPath = path.resolve(ASSET_ROOT, rel);
    if (!fullPath.startsWith(ASSET_ROOT)) {
      return res.status(400).json({ error: "Invalid path" });
    }

    if (await fileExists(fullPath)) {
      await fs.unlink(fullPath);
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Delete failed" });
  }
});

// 슬러그 자동 생성
app.get("/api/slugify", (req, res) => {
  const text = req.query.text || "";
  res.json({ slug: safeSlug(text) });
});

app.listen(PORT, () => {
  console.log(`Article editor running: http://localhost:${PORT}`);
  console.log(`ROOT: ${ROOT}`);
});
