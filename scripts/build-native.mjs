// Builds the static web bundle used by the Capacitor Android app.
// TanStack Start's normal build is SSR (nitro/vercel), which the native WebView
// cannot run, so this script:
//   1. runs `vite build` (client + vercel static output),
//   2. copies the static assets into dist-native/,
//   3. generates a self-bootstrapping index.html that loads the hashed client
//      bundle (the client entry hydrates/renders the app on its own, no SSR).
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, ".vercel", "output", "static");
const outDir = join(root, "dist-native");

console.log("[build-native] running vite build (production)…");
execSync("npx vite build", { cwd: root, stdio: "inherit", env: { ...process.env, NODE_ENV: "production" } });

if (!existsSync(srcDir)) {
  console.error(`[build-native] expected static output at ${srcDir} but it doesn't exist`);
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, "assets"), { recursive: true });

for (const entry of readdirSync(srcDir)) {
  if (entry === "sw.js" || entry === "_headers" || entry === "_redirects") continue;
  cpSync(join(srcDir, entry), join(outDir, entry), { recursive: true });
}

const assetDir = join(outDir, "assets");
const indexJs = readdirSync(assetDir).find((f) => /^index-[\w-]+\.js$/.test(f));
const stylesCss = readdirSync(assetDir).find((f) => /^styles-[\w-]+\.css$/.test(f));

if (!indexJs) {
  console.error("[build-native] could not find the client entry chunk (assets/index-*.js)");
  process.exit(1);
}

const cssHref = stylesCss ? `<link rel="stylesheet" href="/assets/${stylesCss}" />` : "";
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="color-scheme" content="dark" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>ScreenFlow</title>
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/favicon.ico" />
    ${cssHref}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${indexJs}"></script>
  </body>
</html>
`;

writeFileSync(join(outDir, "index.html"), html);

console.log(`[build-native] wrote ${outDir}\\index.html (entry: ${indexJs})`);
