#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'yaml';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_PATH), '../..');
const MANIFEST_PATH = path.join(ROOT, '_data/social_images.json');
const OUTPUT_DIR = '/social-preview';
const DEFAULT_SOURCE = '/assets/img/home/SEO.png';
const WORDMARK_PATH = path.join(ROOT, 'assets/img/logo/lufelnet_text.png');
const WIDTH = 1200;
const HEIGHT = 630;
const GUIDE_PREFIX = '/apps/guides/data/assets/';
const PAGE_EXTENSION = /\.(html?|md|markdown)$/i;

function hash(...parts) {
  const digest = createHash('sha256');
  for (const part of parts) digest.update(part);
  return digest.digest('hex').slice(0, 16);
}

function* pageFiles(directory, recursive = true) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory() && recursive && !/^[._]/.test(entry.name)) {
      yield* pageFiles(filename);
    } else if (entry.isFile() && PAGE_EXTENSION.test(entry.name)) {
      yield filename;
    }
  }
}

function collectSources() {
  const sources = new Map([[DEFAULT_SOURCE, 'default share image']]);
  const files = [
    ...pageFiles(ROOT, false),
    ...pageFiles(path.join(ROOT, 'pages')),
    ...pageFiles(path.join(ROOT, 'apps'))
  ];
  for (const filename of files) {
    const text = fs.readFileSync(filename, 'utf8');
    const frontMatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(text);
    if (!frontMatter || !/^image\s*:/m.test(frontMatter[1])) continue;
    const page = parse(frontMatter[1]);
    if (['default', 'maps'].includes(page?.layout) && typeof page.image === 'string' &&
        page.image.startsWith('/') && !page.image.startsWith('//')) {
      sources.set(page.image, path.relative(ROOT, filename));
    }
  }
  return sources;
}

function backdrop() {
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const center = Math.max(0, 1 - Math.hypot((x - WIDTH / 2) / 670, (y - 265) / 500));
      const diagonal = x + y * 0.74;
      const band = diagonal > 247 && diagonal < 272 || diagonal > 1398 && diagonal < 1430;
      const offset = (y * WIDTH + x) * 3;
      pixels[offset] = 23 + center * 64 + (band ? 29 : 0);
      pixels[offset + 1] = 16 + center * 23 + (band ? 4 : 0);
      pixels[offset + 2] = 26 + center * 27 + (band ? 10 : 0);
    }
  }
  return pixels;
}

async function centeredLayer(pipeline, maxWidth, maxHeight, centerY) {
  const { data, info } = await pipeline
    .resize({ width: maxWidth, height: maxHeight, fit: 'inside' })
    .png().toBuffer({ resolveWithObject: true });
  return {
    input: data,
    left: Math.floor((WIDTH - info.width) / 2),
    top: Math.round(centerY - info.height / 2)
  };
}

async function renderCard(source, input, design) {
  const layers = [];
  const isGuide = source.startsWith(GUIDE_PREFIX);
  if (source === DEFAULT_SOURCE) {
    layers.push(await design.brand);
  } else if (isGuide) {
    const metadata = await sharp(input).metadata();
    const page = Math.floor((metadata.pages || 1) / 2);
    layers.push(await centeredLayer(sharp(input, { page }).autoOrient(), 1160, 582, HEIGHT / 2));
  } else {
    layers.push(
      await centeredLayer(sharp(input).autoOrient(), 876, 472, 269),
      await design.signature
    );
  }
  return sharp(design.background, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
    .composite(layers)
    .jpeg({ quality: isGuide ? 84 : 82, mozjpeg: true })
    .toBuffer();
}

function writeAtomically(filename, bytes) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, bytes);
    fs.renameSync(temporary, filename);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

export async function generateSocialImages() {
  const sources = collectSources();
  const previousJson = fs.existsSync(MANIFEST_PATH) ? fs.readFileSync(MANIFEST_PATH, 'utf8') : '';
  const previous = previousJson ? JSON.parse(previousJson).files : {};
  const wordmark = fs.readFileSync(WORDMARK_PATH);
  const recipeHash = hash(
    fs.readFileSync(SCRIPT_PATH, 'utf8').replace(/\r\n/g, '\n'),
    wordmark,
    JSON.stringify(sharp.versions)
  );
  const design = {
    background: backdrop(),
    brand: centeredLayer(sharp(wordmark), 570, 190, HEIGHT / 2),
    signature: centeredLayer(sharp(wordmark), 172, 54, 558)
  };
  const outputPath = path.join(ROOT, OUTPUT_DIR);
  fs.mkdirSync(outputPath, { recursive: true });
  const files = {};
  let rendered = 0;
  const entries = [...sources.entries()].sort(([one], [two]) => one.localeCompare(two, 'en'));

  async function buildImage([source, page]) {
    const inputPath = path.resolve(ROOT, decodeURIComponent(source.slice(1)));
    if (!inputPath.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(inputPath)) {
      throw new Error(`Missing social image "${source}" referenced by ${page}`);
    }
    const input = fs.readFileSync(inputPath);
    const fingerprint = hash(recipeHash, source, input);
    const cached = previous[source];
    if (cached?.fingerprint === fingerprint && fs.existsSync(path.join(ROOT, cached.url))) return cached;

    const image = await renderCard(source, input, design);
    const url = `${OUTPUT_DIR}/${hash(image)}.jpg`;
    const filename = path.join(ROOT, url);
    if (!fs.existsSync(filename)) writeAtomically(filename, image);
    rendered++;
    return { url, width: WIDTH, height: HEIGHT, fingerprint };
  }

  for (let index = 0; index < entries.length; index += 8) {
    const batch = entries.slice(index, index + 8);
    const cards = await Promise.all(batch.map(buildImage));
    for (const [offset, [source]] of batch.entries()) files[source] = cards[offset];
  }

  const output = `${JSON.stringify({ default: files[DEFAULT_SOURCE], files }, null, 2)}\n`;
  const changed = previousJson !== output;
  if (changed) {
    writeAtomically(MANIFEST_PATH, output);
    const activeUrls = new Set(Object.values(files).map(card => card.url));
    for (const { url } of Object.values(previous)) {
      if (!activeUrls.has(url) && path.posix.dirname(url) === OUTPUT_DIR && /^[0-9a-f]{16}\.jpg$/.test(path.posix.basename(url))) {
        fs.rmSync(path.join(ROOT, url), { force: true });
      }
    }
  }
  return { changed, outputPath: MANIFEST_PATH, count: entries.length, rendered };
}

if (path.resolve(process.argv[1] || '') === SCRIPT_PATH) {
  const { count, rendered } = await generateSocialImages();
  console.log(`Social images: ${count} sources, ${rendered} rendered`);
}
