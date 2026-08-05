import { writeFileSync, readFileSync } from "fs";
import { deflateSync } from "zlib";

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crc32Table[i] = c;
}

function chunk(type, data) {
  const h = Buffer.alloc(4);
  h.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const raw = Buffer.concat([t, data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(raw));
  return Buffer.concat([h, t, data, c]);
}

function writePng(path, raw, width, height) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  console.log(`Generated ${path} (${png.length} bytes)`);
}

function setPixel(raw, w, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= w) return;
  const i = y * (w * 4 + 1) + 1 + x * 4;
  raw[i] = r;
  raw[i + 1] = g;
  raw[i + 2] = b;
  raw[i + 3] = a;
}

const FONT = {
  S: ["01110", "10001", "10000", "01110", "00001", "10001", "01110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
};

function drawWordmark(raw, w, h, text, startX, startY, scale, color) {
  const spacing = scale;
  let cursor = startX;
  for (const ch of text) {
    const glyph = FONT[ch];
    if (!glyph) continue;
    for (let gy = 0; gy < glyph.length; gy++) {
      for (let gx = 0; gx < glyph[gy].length; gx++) {
        if (glyph[gy][gx] !== "1") continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            setPixel(raw, w, cursor + gx * scale + sx, startY + gy * scale + sy, color[0], color[1], color[2], color[3] ?? 255);
          }
        }
      }
    }
    cursor += glyph[0].length * scale + spacing;
  }
}

function drawCamera(raw, w, h, cx, cy, radius) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const t = dist / radius;
        let r = Math.round(20 + (80 - 20) * (1 - t));
        let g = Math.round(80 + (140 - 80) * (1 - t));
        let b = Math.round(160 + (220 - 160) * (1 - t));

        const lensR = radius * 0.45;
        if (dist < lensR) {
          r = Math.round(60 + (140 - 60) * (1 - dist / lensR));
          g = Math.round(120 + (190 - 120) * (1 - dist / lensR));
          b = Math.round(200 + (255 - 200) * (1 - dist / lensR));
        }
        const hlR = lensR * 0.3;
        if (dist < hlR) {
          r = 180;
          g = 220;
          b = 255;
        }
        setPixel(raw, w, x, y, r, g, b);
      }
    }
  }
}

// ── OG image 1200x630 ────────────────────────────────────────────────
{
  const W = 1200;
  const H = 630;
  const raw = Buffer.alloc((W * 4 + 1) * H);

  for (let y = 0; y < H; y++) {
    raw[y * (W * 4 + 1)] = 0;
    const t = y / H;
    const top = [13, 13, 26];
    const bottom = [22, 24, 48];
    const bgR = Math.round(top[0] + (bottom[0] - top[0]) * t);
    const bgG = Math.round(top[1] + (bottom[1] - top[1]) * t);
    const bgB = Math.round(top[2] + (bottom[2] - top[2]) * t);
    for (let x = 0; x < W; x++) {
      let r = bgR;
      let g = bgG;
      let b = bgB;

      const glowDx = x - 320;
      const glowDy = y - 300;
      const glow = Math.sqrt(glowDx * glowDx + glowDy * glowDy) / 560;
      const glowF = Math.max(0, 1 - glow);
      r = Math.round(r + 70 * glowF * glowF);
      g = Math.round(g + 120 * glowF * glowF);
      b = Math.round(b + 220 * glowF * glowF);

      const i = y * (W * 4 + 1) + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = 255;
    }
  }

  drawCamera(raw, W, H, 300, 315, 140);
  drawWordmark(raw, W, H, "SCREENFLOW", 520, 280, 11, [235, 240, 255]);

  writePng("public/og-image.png", raw, W, H);
}

// ── favicon.ico (PNG-encoded, 192px) ─────────────────────────────────
{
  const png = readFileSync("public/pwa-192x192.png");
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(192, 0); // width
  entry.writeUInt8(192, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bit count
  entry.writeUInt32LE(png.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset

  writeFileSync("public/favicon.ico", Buffer.concat([header, entry, png]));
  console.log("Generated public/favicon.ico");
}
