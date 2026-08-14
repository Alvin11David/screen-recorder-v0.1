import { motion } from "framer-motion";
import { Download } from "lucide-react";

import { isAndroid } from "@/lib/platform";
import { isNativeAndroid } from "@/lib/native";

const APK_URL = "/install";

export function AndroidDownloadButton() {
  // Only show on Android browsers — never inside the installed app or on desktop.
  if (typeof window === "undefined") return null;
  if (!isAndroid() || isNativeAndroid()) return null;

  return (
    <motion.a
      href={APK_URL}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 22 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Download the ScreenFlow Android app (APK)"
      className="fixed bottom-5 right-5 z-[9997] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] text-white shadow-[0_0_24px_oklch(0.74_0.15_222/0.55)] animate-breathe"
    >
      <motion.span
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-2 rounded-3xl bg-[oklch(0.74_0.15_222/0.3)] blur-xl pointer-events-none"
      />
      <Download className="relative h-6 w-6" />
    </motion.a>
  );
}
