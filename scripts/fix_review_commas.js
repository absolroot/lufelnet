// Fix missing comma after review in per-character review.js files
// Use when some files got broken like:
//   review: `...`
//   review_en: `...`,
//
// Run:
//   node scripts/fix_review_commas.js
//
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CHAR_DIR = path.join(ROOT, 'data', 'characters');

function listDirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(p, d.name));
}

function read(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}
function write(p, s) {
  try { fs.writeFileSync(p, s, 'utf8'); return true; } catch { return false; }
}

function fixOne(content) {
  // Add comma after review template literal if immediately followed by another key
  // Safe single replacement to avoid over-fixing
  const before = content;
  const re = /(review\s*:\s*`[\s\S]*?`)(\s*\n\s*[a-zA-Z_][\w]*\s*:)/;
  if (re.test(content)) {
    content = content.replace(re, '$1,$2');
  }
  return content !== before ? content : null;
}

function main() {
  const dirs = listDirs(CHAR_DIR);
  const fixed = [];
  dirs.forEach(dir => {
    const file = path.join(dir, 'review.js');
    const code = read(file);
    if (!code) return;
    const next = fixOne(code);
    if (next) {
      if (write(file, next)) fixed.push(path.relative(ROOT, file));
    }
  });
  if (fixed.length) {
    console.log('Fixed missing commas in:');
    fixed.forEach(f => console.log('- ' + f));
  } else {
    console.log('No fixes applied.');
  }
}

main();


