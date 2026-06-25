import opentype from 'opentype.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.resolve(__dirname, '../public/fonts/Pacifico.ttf');

const buffer = readFileSync(fontPath);
const font = opentype.parse(buffer.buffer);
const text = 'design';
const fontSize = 72;

// Get full word path with kerning
const fullPath = font.getPath(text, 0, fontSize, fontSize);
const fullD = fullPath.toPathData(2);
const bbox = fullPath.getBoundingBox();

// Get individual letter paths
let x = 0;
const letterPaths = [];
for (let i = 0; i < text.length; i++) {
  const glyph = font.charToGlyph(text[i]);
  const letterPath = font.getPath(text[i], x, fontSize, fontSize);
  letterPaths.push({ char: text[i], d: letterPath.toPathData(2) });
  x += glyph.advanceWidth * (fontSize / font.unitsPerEm);
  if (i < text.length - 1) {
    const kerning = font.getKerningValue(
      font.charToGlyph(text[i]),
      font.charToGlyph(text[i + 1])
    );
    x += kerning * (fontSize / font.unitsPerEm);
  }
}

// Calculate viewBox
const pad = 4;
const vbX = Math.floor(bbox.x1) - pad;
const vbY = Math.floor(bbox.y1) - pad;
const vbW = Math.ceil(bbox.x2 - bbox.x1) + pad * 2;
const vbH = Math.ceil(bbox.y2 - bbox.y1) + pad * 2;

console.log(`// SVG data for "design" in Pacifico (fontSize: ${fontSize})`);
console.log(`// viewBox: "${vbX} ${vbY} ${vbW} ${vbH}"`);
console.log('');
console.log(`const DESIGN_VIEWBOX = '${vbX} ${vbY} ${vbW} ${vbH}';`);
console.log('');
console.log(`// Full word as single path (continuous stroke draw):`);
console.log(`const DESIGN_FULL_PATH = '${fullD}';`);
console.log('');
console.log(`// Individual letter paths (staggered animation):`);
console.log(`const DESIGN_LETTER_PATHS = ${JSON.stringify(letterPaths, null, 2)};`);
