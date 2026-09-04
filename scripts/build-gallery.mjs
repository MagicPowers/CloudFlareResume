/**
 * Scans public/photos/<era>/ and writes src/data/gallery.generated.ts.
 *
 * Drop images into the era folders, run `npm run photos`, and the gallery,
 * timeline and lightbox all pick them up. Dimensions are read at build time so
 * the masonry layout never shifts.
 *
 * Captions are optional. Two ways to set one:
 *   1. Name the file with a caption after a double underscore:
 *        2019__first-day-as-team-lead.jpg
 *   2. Add public/photos/captions.json:
 *        { "webio-lead/2019-offsite.jpg": "Team offsite, Wicklow" }
 */
import {
  readdirSync,
  statSync,
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { join, extname, relative } from "node:path";
import { imageSize } from "image-size";

const ROOT = process.cwd();
const PHOTOS_DIR = join(ROOT, "public", "photos");
const OUT = join(ROOT, "src", "data", "gallery.generated.ts");

const VALID_ERAS = [
  "trinity",
  "science-gallery",
  "webio-early",
  "webio-lead",
  "webio-dx",
  "revium",
  "hertz",
  "cycling",
  "dnd",
  "misc",
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function loadCaptions() {
  const file = join(PHOTOS_DIR, "captions.json");
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.warn("  ! captions.json is not valid JSON — ignoring it");
    return {};
  }
}

function captionFromFilename(name) {
  const base = name.replace(extname(name), "");
  const idx = base.indexOf("__");
  if (idx === -1) return undefined;
  return base
    .slice(idx + 2)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.has(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

function main() {
  const captions = loadCaptions();
  const photos = [];

  {
    // Git can't track empty directories, so the era folders won't survive a
    // fresh clone or a browser-based upload. Recreate any that are missing —
    // that way the folder layout is guaranteed by this script rather than by
    // placeholder files that tooling likes to drop.
    for (const era of VALID_ERAS) {
      const dir = join(PHOTOS_DIR, era);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      for (const file of walk(dir).sort()) {
        const rel = relative(PHOTOS_DIR, file).split(/[\\/]/).join("/");
        let dims;
        try {
          dims = imageSize(readFileSync(file));
        } catch {
          console.warn(`  ! could not read dimensions for ${rel} — skipping`);
          continue;
        }
        if (!dims?.width || !dims?.height) continue;

        photos.push({
          src: `/photos/${rel}`,
          era,
          width: dims.width,
          height: dims.height,
          caption: captions[rel] ?? captionFromFilename(file.split(/[\\/]/).pop()),
        });
      }
    }
  }

  const body = `// GENERATED FILE — do not edit by hand.
// Run \`npm run photos\` after adding or removing images in public/photos/.

import type { Photo } from "./gallery.types";

export const generatedPhotos: Photo[] = ${JSON.stringify(photos, null, 2)};
`;

  writeFileSync(OUT, body);
  const byEra = photos.reduce((acc, p) => {
    acc[p.era] = (acc[p.era] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`\n  Gallery manifest written — ${photos.length} photo(s)`);
  for (const [era, n] of Object.entries(byEra)) console.log(`    ${era.padEnd(18)} ${n}`);
  if (photos.length === 0) {
    console.log("    (drop images into public/photos/<era>/ and run this again)");
  }
  console.log("");
}

main();
