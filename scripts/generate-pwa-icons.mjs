import { writeFileSync, mkdirSync } from "fs";
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

function cameraPixel(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = size / 2;
  const cy = size / 2;
  const bodyR = size * 0.36;

  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const i = y * (size * 4 + 1) + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background
      raw[i] = 12;
      raw[i + 1] = 12;
      raw[i + 2] = 24;
      raw[i + 3] = 255;

      if (dist < bodyR) {
        // Camera body
        const t = dist / bodyR;
        raw[i] = Math.round(20 + (80 - 20) * (1 - t));
        raw[i + 1] = Math.round(80 + (140 - 80) * (1 - t));
        raw[i + 2] = Math.round(160 + (220 - 160) * (1 - t));
        raw[i + 3] = 255;

        // Lens
        const lensR = bodyR * 0.45;
        if (dist < lensR) {
          raw[i] = Math.round(60 + (140 - 60) * (1 - dist / lensR));
          raw[i + 1] = Math.round(120 + (190 - 120) * (1 - dist / lensR));
          raw[i + 2] = Math.round(200 + (255 - 200) * (1 - dist / lensR));
        }

        // Highlight
        const hlR = lensR * 0.3;
        if (dist < hlR) {
          raw[i] = 180;
          raw[i + 1] = 220;
          raw[i + 2] = 255;
        }

        // Camera top detail
        const topY = cy - bodyR * 0.55;
        if (y > topY - 2 && y < topY + 2 && Math.abs(x - cx) < bodyR * 0.25) {
          raw[i] = 15;
          raw[i + 1] = 15;
          raw[i + 2] = 30;
        }
      }
    }
  }
  return raw;
}

for (const size of [192, 512]) {
  const raw = cameraPixel(size);
  const deflated = deflateSync(raw);

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  const png = Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflated),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  writeFileSync(`public/pwa-${size}x${size}.png`, png);
  console.log(`Generated public/pwa-${size}x${size}.png (${png.length} bytes)`);
}
