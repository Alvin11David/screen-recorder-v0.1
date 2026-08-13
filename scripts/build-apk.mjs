// Builds the Android debug APK and copies it into public/ so the deployed
// website can serve it for download (e.g. https://<site>/ScreenFlow.apk).
//
//   npm run build:apk
//
// The resulting public/ScreenFlow.apk should be committed so the production
// build (Vercel/Netlify) includes it.
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const androidDir = join(root, "android");
const sourceApk = join(androidDir, "app", "build", "outputs", "apk", "debug", "app-debug.apk");
const publicDir = join(root, "public");
const targetApk = join(publicDir, "ScreenFlow.apk");

const isWindows = process.platform === "win32";
const gradlew = isWindows ? join(androidDir, "gradlew.bat") : join(androidDir, "gradlew");

console.log("[build-apk] building debug APK...");
execSync(`"${gradlew}" assembleDebug`, { cwd: androidDir, stdio: "inherit" });

if (!existsSync(sourceApk)) {
  console.error(`[build-apk] expected APK at ${sourceApk} but it doesn't exist`);
  process.exit(1);
}

mkdirSync(publicDir, { recursive: true });
copyFileSync(sourceApk, targetApk);

const sizeMb = (statSync(targetApk).size / 1024 / 1024).toFixed(1);
console.log(`[build-apk] copied APK to ${targetApk} (${sizeMb} MB)`);
