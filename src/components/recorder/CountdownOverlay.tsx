import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RecorderStatus } from "@/hooks/use-screen-recorder";

export function CountdownOverlay({
  countdown,
  onCancel,
  status,
}: {
  countdown: number;
  onCancel: () => void;
  status?: RecorderStatus;
}) {
  const [phase, setPhase] = useState<"countdown" | "go" | null>(null);
  const [showCancel, setShowCancel] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      setPhase("countdown");
      setShowCancel(true);
    }
  }, [countdown]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (countdown === 0 && phase === "countdown" && (status === "countdown" || status === "recording")) {
      setPhase("go");
      setShowCancel(false);
      t = setTimeout(() => setPhase(null), 600);
    }
    return () => clearTimeout(t);
  }, [countdown, phase, status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showCancel) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, showCancel]);

  return (
    <AnimatePresence>
      {phase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40"
        >
          {phase === "countdown" && (
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="block font-display text-[10rem] font-bold text-white drop-shadow-2xl"
                  style={{ textShadow: "0 0 60px oklch(0.74 0.15 222 / 0.4)" }}
                >
                  {countdown}
                </motion.span>
              </AnimatePresence>
              {showCancel && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={onCancel}
                  className="mt-8 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/50 ring-1 ring-white/[0.08] backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:text-white/80"
                >
                  Cancel (Esc)
                </motion.button>
              )}
            </div>
          )}
          {phase === "go" && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-display text-[6rem] font-bold text-white"
              style={{ textShadow: "0 0 60px oklch(0.74 0.15 222 / 0.4)" }}
            >
              Go!
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
