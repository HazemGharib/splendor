/**
 * Applies rounded-corner alpha mask to PWA / favicon PNGs in public/.
 * Run: node scripts/round-public-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Corner radius as a fraction of min(width, height); ~18% matches common app-icon feel */
const RADIUS_RATIO = 0.1875;

const FILES = ['favicon.png', 'icon-192.png', 'icon-512.png'];

async function applyRoundedCorners(absPath) {
  const pipeline = sharp(absPath);
  const { width, height } = await pipeline.metadata();
  if (!width || !height) {
    throw new Error(`Could not read dimensions: ${absPath}`);
  }

  const r = Math.max(2, Math.round(Math.min(width, height) * RADIUS_RATIO));
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="${r}" ry="${r}" fill="#ffffff"/>
    </svg>`
  );

  const out = await sharp(absPath)
    .ensureAlpha()
    .composite([{ input: svg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  writeFileSync(absPath, out);
  console.log(`rounded ${absPath} (${width}×${height}, rx=${r})`);
}

for (const name of FILES) {
  await applyRoundedCorners(join(root, 'public', name));
}
