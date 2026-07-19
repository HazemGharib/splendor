/**
 * Convert public/assets PNGs to WebP (resize oversized card/noble art).
 * Run: node scripts/convert-assets-to-webp.mjs [--delete]
 *
 * --delete  Remove source PNGs after a successful WebP write.
 */
import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, relative, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const assetsDir = join(root, 'public', 'assets');
const shouldDelete = process.argv.includes('--delete');

const QUALITY = 80;
/** Cards/nobles render ~176×240 CSS px; 640 covers 3× DPR with headroom. */
const CARD_NOBLE_MAX_WIDTH = 640;

function walkPngs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walkPngs(abs, out);
    else if (extname(name).toLowerCase() === '.png') out.push(abs);
  }
  return out;
}

function maxWidthFor(relPath) {
  if (relPath.startsWith('cards/') || relPath.startsWith('nobles/')) {
    return CARD_NOBLE_MAX_WIDTH;
  }
  return null;
}

async function convert(absPng) {
  const rel = relative(assetsDir, absPng).split('\\').join('/');
  const outPath = join(dirname(absPng), `${basename(absPng, '.png')}.webp`);
  const maxWidth = maxWidthFor(rel);

  let pipeline = sharp(absPng).rotate();
  const meta = await pipeline.metadata();
  if (maxWidth && meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  const { size } = await pipeline
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);

  const before = statSync(absPng).size;
  console.log(
    `${rel.padEnd(42)} ${(before / 1024).toFixed(0).padStart(5)}KB → ${(size / 1024).toFixed(0).padStart(4)}KB`
  );

  if (shouldDelete) {
    unlinkSync(absPng);
  }

  return { before, after: size };
}

const files = walkPngs(assetsDir);
if (files.length === 0) {
  console.log('No PNG files found under public/assets');
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;
for (const file of files) {
  const { before, after } = await convert(file);
  totalBefore += before;
  totalAfter += after;
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB` +
    ` (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% smaller)` +
    (shouldDelete ? ' [source PNGs deleted]' : '')
);
