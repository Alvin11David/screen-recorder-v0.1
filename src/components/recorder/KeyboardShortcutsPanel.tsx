import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface KeyboardShortcutsPanelProps {
  open: boolean;
  onClose: () => void;
}

const GROUPS = [
  {
    title: "Recording",
    shortcuts: [
      { keys: ["Alt", "R"], label: "Start recording" },
      { keys: ["Space"], label: "Pause / Resume" },
      { keys: ["Esc"], label: "Stop recording" },
      { keys: ["Alt", "N"], label: "New recording (reset)" },
    ],
  },
  {
    title: "Overlays & Tools",
    shortcuts: [
      { keys: ["Alt", "S"], label: "Toggle Spotlight mode" },
      { keys: ["Alt", "Z"], label: "Toggle Zoom lens" },
      { keys: ["Alt", "W"], label: "Toggle Whiteboard" },
      { keys: ["Alt", "A"], label: "Toggle Annotations" },
      { keys: ["Alt", "T"], label: "Toggle Teleprompter" },
    ],
  },
  {
    title: "Preview Controls",
    shortcuts: [
      { keys: ["Scroll"], label: "Resize spotlight / zoom" },
      { keys: ["Drag"], label: "Reposition camera or mini-bar" },
    ],
  },
  {
    title: "Interface",
    shortcuts: [
      { keys: ["Alt", "H"], label: "Open recording history" },
      { keys: ["Alt", "K"], label: "Show keyboard shortcuts" },
      { keys: ["Alt", "E"], label: "Open video editor" },
    ],
  },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded-md bg-white/[0.07] px-2 py-0.5 font-mono text-[11px] text-white/60 ring-1 ring-white/[0.12] shadow-[0_1px_0_oklch(0_0_0/0.4)] min-w-[28px]">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsPanel({ open, onClose }: KeyboardShortcutsPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="shortcuts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9960] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            key="shortcuts-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed inset-0 z-[9961] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg rounded-2xl bg-[oklch(0.13_0.025_264/0.97)] backdrop-blur-2xl shadow-2xl ring-1 ring-white/[0.08] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <Keyboard className="h-4 w-4 text-primary/70" />
                  </div>
                  <h2 className="font-display text-sm font-semibold text-white">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shortcut groups */}
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                      {group.title}
                    </p>
                    <div className="space-y-1.5">
                      {group.shortcuts.map(({ keys, label }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-xl bg-white/[0.025] px-3.5 py-2.5"
                        >
                          <span className="text-sm text-white/55">{label}</span>
                          <div className="flex items-center gap-1">
                            {keys.map((key, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {i > 0 && <span className="text-[10px] text-white/20">+</span>}
                                <Kbd>{key}</Kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.05] px-6 py-3">
                <p className="text-center text-[10px] text-white/20">
                  Shortcuts work when the app is focused · Press <Kbd>Esc</Kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
