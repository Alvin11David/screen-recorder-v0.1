import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, MonitorSmartphone, Smartphone, Wifi, X, Zap } from "lucide-react";

import { isAndroid } from "@/lib/platform";
import { isNativeAndroid } from "@/lib/native";

const APK_URL = "/ScreenFlow.apk";
const DISMISS_KEY = "screenflow:apk-prompt-dismissed";

const PERKS = [
  { icon: Smartphone, text: "Native screen recording" },
  { icon: Wifi, text: "Works fully offline" },
  { icon: Zap, text: "Faster, no browser UI" },
];

export function AndroidApkPrompt() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only offer the APK to Android browsers — never inside the installed app.
    if (!isAndroid() || isNativeAndroid()) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }
    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="fixed inset-x-4 bottom-4 z-[9998] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[320px]"
        >
          <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse,oklch(0.74_0.15_222/0.15)_0%,transparent_70%)] blur-xl pointer-events-none" />

          <div className="relative rounded-2xl bg-[oklch(0.14_0.025_264/0.95)] backdrop-blur-2xl ring-1 ring-white/[0.1] shadow-[0_24px_64px_-16px_oklch(0_0_0/0.7),0_0_0_1px_oklch(1_0_0/0.05)]">
            <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-[oklch(0.74_0.15_222)] to-transparent opacity-60" />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] shadow-[0_0_20px_oklch(0.74_0.15_222/0.35)]">
                    <MonitorSmartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">
                      Get the ScreenFlow app
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">Better experience on Android</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/25 transition-all hover:bg-white/[0.07] hover:text-white/60"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 space-y-2">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[oklch(0.74_0.15_222/0.15)]">
                      <Icon className="h-3 w-3 text-[oklch(0.74_0.15_222)]" />
                    </div>
                    <span className="text-xs text-white/50">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 h-px bg-white/[0.05]" />

              <div className="flex gap-2">
                <a
                  href={APK_URL}
                  download
                  className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_oklch(0.74_0.15_222/0.3)] transition-all hover:shadow-[0_0_28px_oklch(0.74_0.15_222/0.45)] hover:brightness-110 active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  Download APK
                </a>
                <button
                  onClick={handleDismiss}
                  className="rounded-xl bg-white/[0.05] px-4 py-2.5 text-sm text-white/40 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.08] hover:text-white/60"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
