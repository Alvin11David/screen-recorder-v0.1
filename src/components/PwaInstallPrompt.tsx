import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    setShow(false);
  };

  if (!show || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-black/80 px-5 py-3.5 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-[0_0_16px_oklch(0.74_0.15_222/0.3)]">
          <Download className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">Install ScreenCapture Pro</p>
          <p className="text-xs text-white/40">Works offline. No installs needed.</p>
        </div>
        <button
          onClick={handleInstall}
          className="rounded-lg bg-white/[0.08] px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/[0.1] transition-all hover:bg-white/[0.12]"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-lg p-2 text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
