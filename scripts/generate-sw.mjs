import { readdirSync, writeFileSync, statSync, existsSync } from "fs";
import { join } from "path";

const CLIENT_DIR = "dist/client";
const SW_PATH = join(CLIENT_DIR, "sw.js");
const CACHE = "screencapture-v1";

if (!existsSync(CLIENT_DIR)) {
  console.log("No dist/client directory found — skipping SW generation.");
  process.exit(0);
}

function walk(dir, base = "") {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full, join(base, name)));
    } else {
      entries.push("/" + join(base, name).replace(/\\/g, "/"));
    }
  }
  return entries;
}

const files = walk(CLIENT_DIR);
const precache = files.filter(
  (f) =>
    !f.endsWith(".map") &&
    !f.endsWith("sw.js") &&
    !f.endsWith("registerSW.js") &&
    !f.startsWith("/server") &&
    !f.startsWith("/nitro"),
);

const code = `const C = "${CACHE}";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(C).then((c) => c.addAll(${JSON.stringify(precache)})).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k))))
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const ct = r.clone();
        caches.open(C).then((c) => {
          if (new URL(e.request.url).origin === self.location.origin) c.put(e.request, ct);
        });
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("/")))
  );
});
`;

writeFileSync(SW_PATH, code, "utf-8");
console.log(`Generated ${SW_PATH} with ${precache.length} precached files`);
