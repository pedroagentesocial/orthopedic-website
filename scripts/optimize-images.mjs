#!/usr/bin/env node
/**
 * Optimize JPG images in public/images in-place.
 *
 *  - Resize to max width 1600px (preserves aspect ratio; no upscaling)
 *  - Re-encode as JPEG with mozjpeg + quality 78
 *  - Writes to a temp file then renames over the original (safe write)
 *
 * Usage:  npm run optimize:images
 */

import sharp from 'sharp';
import { readdir, rename, unlink, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';

const DIR = 'public/images';
const MAX_WIDTH = 1600;
const QUALITY = 78;

const isJpg = (f) => /\.(jpe?g)$/i.test(f);

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  let files;
  try {
    files = (await readdir(DIR)).filter(isJpg);
  } catch (err) {
    console.error(`Could not read ${DIR}:`, err.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(`No JPG files found in ${DIR}.`);
    return;
  }

  console.log(`Optimizing ${files.length} image(s) in ${DIR} — max width ${MAX_WIDTH}px, quality ${QUALITY}\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const input = join(DIR, file);
    const tmp = join(DIR, `.tmp-${basename(file)}`);
    const before = (await stat(input)).size;
    totalBefore += before;

    try {
      await sharp(input)
        .rotate() // honors EXIF orientation
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(tmp);

      await unlink(input);
      await rename(tmp, input);

      const after = (await stat(input)).size;
      totalAfter += after;
      const pct = Math.round((1 - after / before) * 100);
      console.log(`  ${file.padEnd(36)} ${fmt(before).padStart(9)}  →  ${fmt(after).padStart(8)}  (-${pct}%)`);
    } catch (err) {
      console.error(`  ${file}: FAILED — ${err.message}`);
      // Cleanup tmp if it exists
      try { await unlink(tmp); } catch {}
      totalAfter += before;
    }
  }

  const savings = totalBefore - totalAfter;
  const pct = Math.round((savings / totalBefore) * 100);
  console.log(`\nTotal:   ${fmt(totalBefore)}  →  ${fmt(totalAfter)}   (saved ${fmt(savings)}, -${pct}%)`);
}

main();
