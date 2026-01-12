const Editor = toastui.Editor;

const $ = (id) => document.getElementById(id);
const log = (obj) => {
  $("resultLog").textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
};

function getSlug() {
  return ($("slug").value || "").trim();
}

const PREVIEW_BASE_KEY = "lufel.article.previewBase";
const DEFAULT_PREVIEW_BASE = "http://localhost:4000";
const state = {
  lastPostUrl: "",
  lastSlug: "",
  autoTimer: null,
  cleanupTimer: null,
  imageUrls: new Set(),
  suspendCleanup: false
};

const imagePanelState = {
  images: [],
  timer: null
};

function getActiveLang() {
  const active = document.querySelector(".tab.active");
  return active?.dataset?.tab || "kr";
}

function getActiveEditor() {
  const lang = getActiveLang();
  if (lang === "en") return editorEn;
  if (lang === "jp") return editorJp;
  return editorKr;
}

function normalizePreviewBase(value) {
  let base = String(value || "").trim();
  if (!base) return "";
  if (!/^https?:\/\//i.test(base)) base = `http://${base}`;
  return base.replace(/\/+$/, "");
}

function getPreviewBase() {
  const input = $("previewBase");
  return normalizePreviewBase(input?.value) || DEFAULT_PREVIEW_BASE;
}

function buildPreviewUrl(base, postUrl, lang) {
  if (!postUrl) return "";
  const safeBase = normalizePreviewBase(base) || DEFAULT_PREVIEW_BASE;
  const url = new URL(postUrl, `${safeBase}/`);
  if (lang) url.searchParams.set("lang", lang);
  return url.toString();
}

function setPreviewLoading(isLoading) {
  const frame = $("previewFrame");
  const wrap = frame?.parentElement;
  if (!wrap) return;
  wrap.classList.toggle("loading", Boolean(isLoading));
}

function setPreviewFromSaved(data) {
  const postUrl = data?.postUrl || (data?.slug ? `/article/${data.slug}/` : "");
  if (!postUrl) return;
  state.lastPostUrl = postUrl;
  state.lastSlug = data?.slug || state.lastSlug;
  const frame = $("previewFrame");
  if (frame) {
    setPreviewLoading(true);
    frame.src = buildPreviewUrl(getPreviewBase(), postUrl, getActiveLang());
  }
}

function refreshPreviewLang() {
  if (!state.lastPostUrl) return;
  const frame = $("previewFrame");
  if (frame) {
    setPreviewLoading(true);
    frame.src = buildPreviewUrl(getPreviewBase(), state.lastPostUrl, getActiveLang());
  }
}

function scheduleAutoPreview() {
  const toggle = $("autoPreview");
  if (!toggle?.checked) return;
  clearTimeout(state.autoTimer);
  state.autoTimer = setTimeout(() => {
    savePost({ silent: true, updatePreview: true });
  }, 2000);
}

function buildPayload() {
  return {
    slug: ($("slug").value || "").trim(),
    date: ($("date").value || "").trim(), // datetime-local ê°?
    author: ($("author").value || "").trim(),
    categories: ($("categories").value || "")
      .split(",").map(s => s.trim()).filter(Boolean),
    tags: ($("tags").value || "")
      .split(",").map(s => s.trim()).filter(Boolean),

    description: ($("description").value || "").trim(),
    thumbnail: ($("thumbnail").value || "").trim(),
    image: ($("image").value || "").trim(),

    titleKr: ($("titleKr").value || "").trim(),
    titleEn: ($("titleEn").value || "").trim(),
    titleJp: ($("titleJp").value || "").trim(),

    // Toast UI??getMarkdown()?¼ë¡œ ?µì¼
    contentKr: editorKr.getMarkdown(),
    contentEn: editorEn.getMarkdown(),
    contentJp: editorJp.getMarkdown()
  };
}

function ensureDefaultMeta() {
  if (!$("author").value) $("author").value = "AbsolRoot";
  if (!$("categories").value) $("categories").value = "Guide";
  if (!$("tags").value) $("tags").value = "guide";
}

async function savePost({ silent = false, updatePreview = true } = {}) {
  try {
    const payload = buildPayload();

    if (!payload.slug) {
      if (!silent) alert("Slugë¥??…ë ¥?˜ì„¸??");
      return null;
    }
    if (!payload.titleKr) {
      if (!silent) alert("KR Title???…ë ¥?˜ì„¸??");
      return null;
    }

    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (!silent) log(data);
    if (updatePreview) setPreviewFromSaved(data);
    return data;
  } catch (e) {
    if (!silent) {
      log(`Save failed: ${e.message}`);
    } else {
      console.warn("Auto preview failed:", e);
    }
    return null;
  }
}

function extractImageUrlsFromMarkdown(markdown) {
  const urls = new Set();
  if (!markdown) return urls;

  const mdRegex = /!\[[^\]]*]\(([^)]+)\)/g;
  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;

  const capture = (raw) => {
    if (!raw) return;
    const cleaned = String(raw).trim().replace(/^<|>$/g, "");
    const first = cleaned.split(/\s+/)[0];
    const normalized = normalizeAssetUrl(first);
    if (normalized) urls.add(normalized);
  };

  let match;
  while ((match = mdRegex.exec(markdown)) !== null) capture(match[1]);
  while ((match = htmlRegex.exec(markdown)) !== null) capture(match[1]);

  return urls;
}

function normalizeAssetUrl(url) {
  if (!url) return "";
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return String(url).trim();
  }
}

function collectCurrentImageUrls() {
  const slug = getSlug();
  const prefix = slug ? `/apps/article/asset/${slug}/` : "/apps/article/asset/";
  const urls = new Set();

  [editorKr, editorEn, editorJp].forEach((editor) => {
    extractImageUrlsFromMarkdown(editor.getMarkdown()).forEach((url) => {
      if (url.startsWith(prefix)) urls.add(url);
    });
  });

  const thumbUrl = normalizeAssetUrl($("thumbnail")?.value || "");
  if (thumbUrl.startsWith(prefix)) urls.add(thumbUrl);

  const imageUrl = normalizeAssetUrl($("image")?.value || "");
  if (imageUrl.startsWith(prefix)) urls.add(imageUrl);

  return urls;
}

async function deleteImageByUrl(url) {
  if (!url) return;
  try {
    const res = await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error(await res.text());
  } catch (e) {
    console.warn("Image delete failed:", e);
  }
}

async function cleanupRemovedImages() {
  const slug = getSlug();
  if (!slug) return;
  const prefix = `/apps/article/asset/${slug}/`;
  const current = collectCurrentImageUrls();
  const removed = [...state.imageUrls].filter((url) => url.startsWith(prefix) && !current.has(url));
  if (removed.length === 0) {
    state.imageUrls = current;
    return;
  }

  for (const url of removed) {
    await deleteImageByUrl(url);
  }

  state.imageUrls = current;
}

function scheduleImageCleanup() {
  if (state.suspendCleanup) return;
  clearTimeout(state.cleanupTimer);
  state.cleanupTimer = setTimeout(() => {
    cleanupRemovedImages();
  }, 1500);
}

function updateImageTracking() {
  state.imageUrls = collectCurrentImageUrls();
}

function extractImagesFromMarkdown(markdown) {
  const images = [];
  const seen = new Set();
  if (!markdown) return images;

  const addImage = (src, alt, width) => {
    const normalized = normalizeAssetUrl(src);
    const key = normalized || src;
    if (!key || seen.has(key)) return;
    seen.add(key);
    images.push({
      src,
      alt: alt || "",
      width: width || ""
    });
  };

  const htmlRegex = /<img\b[^>]*>/gi;
  let match;
  while ((match = htmlRegex.exec(markdown)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    const widthMatch = tag.match(/width=["']?(\d+)/i);
    addImage(srcMatch[1], altMatch?.[1] || "", widthMatch?.[1] || "");
  }

  const mdRegex = /!\[([^\]]*)]\(([^)]+)\)/g;
  while ((match = mdRegex.exec(markdown)) !== null) {
    const altText = match[1] || "";
    const raw = match[2];
    const cleaned = String(raw).trim().replace(/^<|>$/g, "");
    const src = cleaned.split(/\s+/)[0];
    addImage(src, altText, "");
  }

  return images;
}

function formatImageLabel(image) {
  const src = image.src || "";
  const clean = src.split("?")[0];
  const name = clean.split("/").pop() || clean;
  const alt = image.alt ? `${image.alt} - ` : "";
  return `${alt}${name}`;
}

function refreshImagePanel() {
  const select = $("imageSelect");
  const widthInput = $("imageWidth");
  const applyBtn = $("btnApplyImageWidth");
  const resetBtn = $("btnResetImageWidth");
  if (!select || !widthInput || !applyBtn || !resetBtn) return;

  const editor = getActiveEditor();
  const images = extractImagesFromMarkdown(editor.getMarkdown());
  imagePanelState.images = images;

  select.innerHTML = "";
  if (images.length === 0) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No images in this tab";
    select.appendChild(empty);
    select.disabled = true;
    widthInput.value = "";
    widthInput.disabled = true;
    applyBtn.disabled = true;
    resetBtn.disabled = true;
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select an image...";
  select.appendChild(placeholder);

  images.forEach((img) => {
    const option = document.createElement("option");
    option.value = img.src;
    option.textContent = formatImageLabel(img);
    select.appendChild(option);
  });

  select.disabled = false;
  widthInput.disabled = false;
  applyBtn.disabled = false;
  resetBtn.disabled = false;
  widthInput.value = "";
}

function syncImageWidthInput() {
  const select = $("imageSelect");
  const widthInput = $("imageWidth");
  if (!select || !widthInput) return;
  const selected = select.value;
  const image = imagePanelState.images.find((img) => img.src === selected);
  widthInput.value = image?.width ? String(image.width) : "";
}

function scheduleImagePanelRefresh() {
  clearTimeout(imagePanelState.timer);
  imagePanelState.timer = setTimeout(() => {
    refreshImagePanel();
  }, 300);
}

async function loadPost(target) {
  const value = String(target || "").trim();
  if (!value) return;

  const isFilename = value.toLowerCase().endsWith(".md") || /^\d{4}-\d{2}-\d{2}-/i.test(value);
  const query = isFilename ? `filename=${encodeURIComponent(value)}` : `slug=${encodeURIComponent(value)}`;
  const res = await fetch(`/api/post?${query}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function fetchPostList() {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

function renderPostOptions(items) {
  const select = $("postSelect");
  if (!select) return;
  select.innerHTML = "";

  if (!items || items.length === 0) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No posts found";
    select.appendChild(empty);
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a post...";
  select.appendChild(placeholder);

  items.forEach((post) => {
    const option = document.createElement("option");
    const dateLabel = post.datePrefix ? `${post.datePrefix} ` : "";
    option.value = post.filename;
    option.textContent = `${dateLabel}${post.title} (${post.filename})`;
    select.appendChild(option);
  });
}

async function refreshPostList() {
  try {
    const data = await fetchPostList();
    renderPostOptions(data.posts || []);
  } catch (e) {
    console.warn("Post list load failed:", e);
  }
}

function applyPostData(data) {
  if (!data) return;
  state.suspendCleanup = true;
  $("slug").value = data.slug || "";
  $("date").value = data.dateLocal || "";
  $("author").value = data.author || "";
  $("categories").value = Array.isArray(data.categories) ? data.categories.join(", ") : "";
  $("tags").value = Array.isArray(data.tags) ? data.tags.join(", ") : "";
  $("description").value = data.description || "";
  $("thumbnail").value = data.thumbnail || "";
  $("image").value = data.image || "";
  $("titleKr").value = data.titleKr || "";
  $("titleEn").value = data.titleEn || "";
  $("titleJp").value = data.titleJp || "";

  editorKr.setMarkdown(data.contentKr || "");
  editorEn.setMarkdown(data.contentEn || "");
  editorJp.setMarkdown(data.contentJp || "");

  state.lastPostUrl = data.postUrl || (data.slug ? `/article/${data.slug}/` : "");
  refreshPreviewLang();
  setTimeout(() => {
    updateImageTracking();
    state.suspendCleanup = false;
  }, 0);
}

function getClipboardImage(event) {
  const items = event.clipboardData?.items || [];
  for (const item of items) {
    if (item.type && item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }
  return null;
}

async function pasteImageToInput(event, input, filename) {
  const file = getClipboardImage(event);
  if (!file) return;
  event.preventDefault();

  try {
    const slug = getSlug() || "untitled";
    const { url } = await uploadImage(file, slug, filename);
    input.value = url;
    if (input.id === "thumbnail" && !$("image").value) {
      $("image").value = url;
    }
    updateImageTracking();
    scheduleAutoPreview();
  } catch (e) {
    alert(`Image paste failed: ${e.message}`);
  }
}

async function uploadImage(blob, slug, filenameOverride) {
  const fd = new FormData();
  fd.append("slug", slug || "untitled");
  const file = filenameOverride
    ? new File([blob], filenameOverride, { type: blob.type || "image/png" })
    : blob;
  fd.append("file", file, file.name || "image.png");

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { url }
}

function updateImageMarkup(markdown, targetSrc, width) {
  const normalizedTarget = normalizeAssetUrl(targetSrc);
  if (!normalizedTarget) return markdown;

  const widthAttr = width ? ` width="${width}"` : "";

  let updated = markdown;
  let replaced = false;

  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  updated = updated.replace(htmlRegex, (full, src) => {
    if (replaced) return full;
    if (normalizeAssetUrl(src) !== normalizedTarget) return full;
    replaced = true;
    const withoutWidth = full.replace(/\swidth=["'][^"']*["']/i, "");
    return withoutWidth.replace("<img", `<img${widthAttr}`);
  });

  if (replaced) return updated;

  const mdRegex = /!\[([^\]]*)]\(([^)]+)\)/g;
  updated = updated.replace(mdRegex, (full, altText, raw) => {
    if (replaced) return full;
    const cleaned = String(raw).trim().replace(/^<|>$/g, "");
    const src = cleaned.split(/\s+/)[0];
    if (normalizeAssetUrl(src) !== normalizedTarget) return full;
    replaced = true;
    const alt = altText || "";
    if (!widthAttr) return `![${alt}](${src})`;
    return `<img src="${src}" alt="${alt}"${widthAttr} />`;
  });

  return updated;
}

const IMAGE_WIDTH_PRESETS = [320, 480, 640];
const imageToolbarState = {
  editor: null,
  img: null
};
const imageToolbars = new Map();

function ensureToolbarStyles(doc) {
  if (doc.getElementById("imageToolbarStyle")) return;
  const style = doc.createElement("style");
  style.id = "imageToolbarStyle";
  style.textContent = `
    .image-toolbar {
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: 6px;
      padding: 6px;
      background: rgba(18, 18, 24, 0.95);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    }
    .image-toolbar.hidden { display: none; }
    .image-toolbar-btn {
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.92);
      padding: 6px 8px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .image-toolbar-btn:hover { background: rgba(255,255,255,0.12); }
  `;
  doc.head.appendChild(style);
}

function ensureImageToolbar(doc) {
  if (imageToolbars.has(doc)) return imageToolbars.get(doc);
  ensureToolbarStyles(doc);

  const toolbar = doc.createElement("div");
  toolbar.className = "image-toolbar hidden";
  toolbar.innerHTML = `
    <button type="button" class="image-toolbar-btn" data-width="320">320</button>
    <button type="button" class="image-toolbar-btn" data-width="480">480</button>
    <button type="button" class="image-toolbar-btn" data-width="640">640</button>
    <button type="button" class="image-toolbar-btn" data-action="custom">Custom</button>
    <button type="button" class="image-toolbar-btn" data-action="reset">Reset</button>
  `;

  doc.body.appendChild(toolbar);
  imageToolbars.set(doc, toolbar);

  toolbar.addEventListener("click", (event) => {
    event.stopPropagation();
    const btn = event.target.closest(".image-toolbar-btn");
    if (!btn || !imageToolbarState.img || !imageToolbarState.editor) return;

    const widthValue = btn.dataset.width;
    if (widthValue) {
      applyImageWidth(imageToolbarState.editor, imageToolbarState.img, Number.parseInt(widthValue, 10));
      return;
    }

    const action = btn.dataset.action;
    if (action === "custom") {
      const current = Math.round(imageToolbarState.img.getBoundingClientRect().width);
      const promptFn = doc.defaultView?.prompt || prompt;
      const alertFn = doc.defaultView?.alert || alert;
      const input = promptFn("Set image width (px). Leave empty to reset.", String(current));
      if (input === null) return;
      const value = String(input).trim();
      if (!value) {
        applyImageWidth(imageToolbarState.editor, imageToolbarState.img, "");
        return;
      }
      const width = Number.parseInt(value, 10);
      if (!Number.isFinite(width) || width <= 0) {
        alertFn("Width must be a positive number.");
        return;
      }
      applyImageWidth(imageToolbarState.editor, imageToolbarState.img, width);
    }

    if (action === "reset") {
      applyImageWidth(imageToolbarState.editor, imageToolbarState.img, "");
    }
  });

  return toolbar;
}

function applyImageWidth(editor, img, width) {
  const markdown = editor.getMarkdown();
  const updated = updateImageMarkup(markdown, img.getAttribute("src"), width);
  if (updated !== markdown) {
    editor.setMarkdown(updated);
    updateImageTracking();
    scheduleAutoPreview();
  }
}

function positionImageToolbar(toolbar, img) {
  const rect = img.getBoundingClientRect();
  const doc = img.ownerDocument;
  const win = doc.defaultView || window;
  const scrollX = win.pageXOffset || 0;
  const scrollY = win.pageYOffset || 0;
  toolbar.style.visibility = "hidden";
  toolbar.classList.remove("hidden");

  const toolbarRect = toolbar.getBoundingClientRect();
  let top = rect.top + scrollY - toolbarRect.height - 8;
  if (top < scrollY + 8) top = rect.bottom + scrollY + 8;

  let left = rect.left + scrollX;
  const maxLeft = scrollX + win.innerWidth - toolbarRect.width - 8;
  if (left > maxLeft) left = maxLeft;
  if (left < scrollX + 8) left = scrollX + 8;

  toolbar.style.top = `${top}px`;
  toolbar.style.left = `${left}px`;
  toolbar.style.visibility = "visible";
}

function hideImageToolbar(doc) {
  if (doc) {
    const toolbar = imageToolbars.get(doc);
    if (toolbar) toolbar.classList.add("hidden");
  } else {
    imageToolbars.forEach((toolbar) => toolbar.classList.add("hidden"));
  }
  imageToolbarState.editor = null;
  imageToolbarState.img = null;
}

function enableImageToolbar(editor) {
  const root = editor.getRootElement?.();
  if (!root || root.__imageToolbarBound) return;
  root.__imageToolbarBound = true;

  const bindToDocument = (doc) => {
    if (!doc || doc.__imageToolbarDocBound) return;
    doc.__imageToolbarDocBound = true;
    const toolbar = ensureImageToolbar(doc);

    doc.addEventListener("click", (event) => {
      if (toolbar.contains(event.target)) return;
      const target = event.target;
      const img = target?.tagName === "IMG" ? target : target?.closest?.("img");
      if (!img) {
        hideImageToolbar(doc);
        return;
      }
      event.stopPropagation();
      imageToolbarState.editor = editor;
      imageToolbarState.img = img;
      positionImageToolbar(toolbar, img);
    }, true);

    doc.addEventListener("scroll", () => hideImageToolbar(doc), true);
  };

  const attachFrames = () => {
    const frames = root.querySelectorAll("iframe");
    frames.forEach((frame) => {
      frame.addEventListener("load", () => {
        bindToDocument(frame.contentDocument);
      });
      if (frame.contentDocument) {
        bindToDocument(frame.contentDocument);
      }
    });
  };

  bindToDocument(root.ownerDocument);
  attachFrames();

  const observer = new MutationObserver(() => {
    attachFrames();
  });
  observer.observe(root, { childList: true, subtree: true });

  const toolbar = ensureImageToolbar(root.ownerDocument);
  const showFromSelection = () => {
    const selection = editor.getSelection?.();
    if (!selection) return;
    const [start] = selection;
    if (!start) return;
    const img = root.querySelector(`img[data-nodeid="${start}"]`);
    if (!img) return;
    imageToolbarState.editor = editor;
    imageToolbarState.img = img;
    positionImageToolbar(toolbar, img);
  };
  editor.on?.("click", showFromSelection);
  editor.on?.("keyup", showFromSelection);
}

function editorHooks(which) {
  return {
    addImageBlobHook: async (blob, callback) => {
      try {
        const slug = getSlug() || "untitled";
        const { url } = await uploadImage(blob, slug);
        callback(url, "image");
        // 썸네일이 비어있으면 첫 이미지로 자동 설정 (원하면 삭제 가능)
        if (!$("thumbnail").value) $("thumbnail").value = url;
        if (!$("image").value) $("image").value = url;
      } catch (e) {
        alert(`[${which}] Image upload failed: ${e.message}`);
      }
      return false;
    }
  };
}

const editorKr = new Editor({
  el: $("editorKr"),
  height: "900px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
  usageStatistics: false,
  hooks: editorHooks("KR")
});

const editorEn = new Editor({
  el: $("editorEn"),
  height: "900px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
  usageStatistics: false,
  hooks: editorHooks("EN")
});

const editorJp = new Editor({
  el: $("editorJp"),
  height: "900px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
  usageStatistics: false,
  hooks: editorHooks("JP")
});

[editorKr, editorEn, editorJp].forEach((editor) => {
  editor.on("change", () => {
    scheduleAutoPreview();
    scheduleImageCleanup();
    scheduleImagePanelRefresh();
  });
});


// 탭 UI
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    refreshPreviewLang();
    refreshImagePanel();
  });
});

// Slug From KR Title
$("btnSlugFromTitle").addEventListener("click", async () => {
  const t = ($("titleKr").value || "").trim();
  if (!t) return alert("KR Title이 비어있습니다.");
  const res = await fetch(`/api/slugify?text=${encodeURIComponent(t)}`);
  const data = await res.json();
  $("slug").value = data.slug;
  scheduleAutoPreview();
});

// Load Post
$("btnLoadPost").addEventListener("click", async () => {
  try {
    const target = ($("postSelect").value || "").trim();
    if (!target) return alert("Select a post.");
    const data = await loadPost(target);
    applyPostData(data);
    log({ ok: true, loaded: data.postFilename || data.slug });
    refreshImagePanel();
  } catch (e) {
    alert(`Load failed: ${e.message}`);
  }
});

$("btnReloadPosts").addEventListener("click", async () => {
  await refreshPostList();
});

// Save
$("btnSave").addEventListener("click", async () => {
  await savePost({ silent: false, updatePreview: true });
});

// Preview
$("btnPreview").addEventListener("click", async () => {
  await savePost({ silent: true, updatePreview: true });
});

const previewBaseInput = $("previewBase");
if (previewBaseInput) {
  const savedBase = localStorage.getItem(PREVIEW_BASE_KEY);
  previewBaseInput.value = savedBase || DEFAULT_PREVIEW_BASE;
  previewBaseInput.addEventListener("change", () => {
    const normalized = normalizePreviewBase(previewBaseInput.value);
    if (normalized) {
      previewBaseInput.value = normalized;
      localStorage.setItem(PREVIEW_BASE_KEY, normalized);
    } else {
      previewBaseInput.value = "";
      localStorage.removeItem(PREVIEW_BASE_KEY);
    }
    refreshPreviewLang();
  });
}

const autoPreviewToggle = $("autoPreview");
if (autoPreviewToggle) {
  autoPreviewToggle.addEventListener("change", () => {
    if (autoPreviewToggle.checked) scheduleAutoPreview();
  });
}

const previewFrame = $("previewFrame");
if (previewFrame) {
  previewFrame.addEventListener("load", () => setPreviewLoading(false));
}

const imageSelect = $("imageSelect");
if (imageSelect) {
  imageSelect.addEventListener("change", syncImageWidthInput);
}

const applyImageWidthBtn = $("btnApplyImageWidth");
if (applyImageWidthBtn) {
  applyImageWidthBtn.addEventListener("click", () => {
    const select = $("imageSelect");
    const widthInput = $("imageWidth");
    if (!select || !widthInput) return;
    const src = select.value;
    if (!src) return alert("Select an image.");
    const value = String(widthInput.value || "").trim();
    if (!value) return alert("Enter a width in px.");
    const width = Number.parseInt(value, 10);
    if (!Number.isFinite(width) || width <= 0) {
      alert("Width must be a positive number.");
      return;
    }
    const editor = getActiveEditor();
    const updated = updateImageMarkup(editor.getMarkdown(), src, width);
    if (updated !== editor.getMarkdown()) {
      editor.setMarkdown(updated);
      updateImageTracking();
      scheduleAutoPreview();
      refreshImagePanel();
    }
  });
}

const resetImageWidthBtn = $("btnResetImageWidth");
if (resetImageWidthBtn) {
  resetImageWidthBtn.addEventListener("click", () => {
    const select = $("imageSelect");
    if (!select) return;
    const src = select.value;
    if (!src) return alert("Select an image.");
    const editor = getActiveEditor();
    const updated = updateImageMarkup(editor.getMarkdown(), src, "");
    if (updated !== editor.getMarkdown()) {
      editor.setMarkdown(updated);
      updateImageTracking();
      scheduleAutoPreview();
      refreshImagePanel();
    }
  });
}

const refreshImagesBtn = $("btnRefreshImages");
if (refreshImagesBtn) {
  refreshImagesBtn.addEventListener("click", refreshImagePanel);
}

document.addEventListener("click", (event) => {
  const insideToolbar = Array.from(imageToolbars.values()).some((toolbar) => toolbar.contains(event.target));
  if (insideToolbar) return;
  hideImageToolbar();
});

window.addEventListener("scroll", () => hideImageToolbar());
window.addEventListener("resize", () => hideImageToolbar());

const thumbnailInput = $("thumbnail");
if (thumbnailInput) {
  thumbnailInput.addEventListener("paste", (event) => {
    pasteImageToInput(event, thumbnailInput, "thumb.png");
  });
}

const thumbnailFileInput = $("thumbnailFile");
if (thumbnailFileInput) {
  thumbnailFileInput.addEventListener("change", async () => {
    const file = thumbnailFileInput.files?.[0];
    if (!file) return;
    try {
      const slug = getSlug() || "untitled";
      const { url } = await uploadImage(file, slug, file.name || "thumb.png");
      $("thumbnail").value = url;
      if (!$("image").value) $("image").value = url;
      updateImageTracking();
      scheduleAutoPreview();
    } catch (e) {
      alert(`Thumbnail upload failed: ${e.message}`);
    } finally {
      thumbnailFileInput.value = "";
    }
  });
}

document.querySelectorAll("input").forEach((input) => {
  if (input.id === "previewBase" || input.id === "autoPreview") return;
  input.addEventListener("input", () => {
    scheduleAutoPreview();
    scheduleImageCleanup();
  });
});

ensureDefaultMeta();
refreshPostList();
updateImageTracking();
refreshImagePanel();

// 기본값: Author를 _config author로 맞추고 싶으면 여기서 세팅
// $("author").value = "Lufeloper";
