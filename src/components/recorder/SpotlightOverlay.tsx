import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotlightOverlayProps {
  active: boolean;
}

type SpotlightMode = "spotlight" | "zoom";

export function SpotlightOverlay({ active }: SpotlightOverlayProps) {
  const [mode, setMode] = useState<SpotlightMode>("spotlight");
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(220);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });

  // Track mouse
  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active]);

  // Smooth position
  useEffect(() => {
    if (!active || !spotlightActive) return;
    const lerp = () => {
      smoothPos.current = {
        x: smoothPos.current.x + (posRef.current.x - smoothPos.current.x) * 0.12,
        y: smoothPos.current.y + (posRef.current.y - smoothPos.current.y) * 0.12,
      };
      setPos({ ...smoothPos.current });
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, spotlightActive]);

  // Keyboard: Alt+S = spotlight, Alt+Z = zoom, scroll = size
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        setSpotlightActive((v) => {
          if (!v) setMode("spotlight");
          return !v;
        });
      }
      if (e.altKey && e.key === "z") {
        e.preventDefault();
        setSpotlightActive((v) => {
          if (!v) setMode("zoom");
          return !v;
        });
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (!spotlightActive) return;
      e.preventDefault();
      setSize((s) => Math.max(80, Math.min(500, s - e.deltaY * 0.5)));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [active, spotlightActive]);

  // Show hint briefly on activation
  useEffect(() => {
    if (!active) return;
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  const isSpotlight = mode === "spotlight";

  return (
    <>
      {/* Spotlight / dim overlay */}
      <AnimatePresence>
        {spotlightActive && isSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9990] pointer-events-none"
            style={{
              background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px,
                transparent 0%,
                transparent ${size * 0.7}px,
                oklch(0 0 0 / 0.55) ${size}px
              )`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Zoom lens */}
      <AnimatePresence>
        {spotlightActive && !isSpotlight && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed z-[9990] pointer-events-none overflow-hidden rounded-full ring-2 ring-white/20 shadow-2xl"
            style={{
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
              backdropFilter: `url('#zoom-filter')`,
              background: "oklch(0 0 0 / 0.1)",
              boxShadow: "0 0 0 2px oklch(1 0 0 / 0.2), 0 20px 60px oklch(0 0 0 / 0.5), inset 0 0 0 1px oklch(1 0 0 / 0.1)",
            }}
          >
            {/* Zoom crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-full h-px bg-white/10" />
              <div className="absolute h-full w-px bg-white/10" />
              <div className="h-4 w-4 rounded-full border border-white/30" />
            </div>
            {/* Edge label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-mono text-white/40 uppercase tracking-wider">
              2× zoom
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight ring */}
      <AnimatePresence>
        {spotlightActive && isSpotlight && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="fixed z-[9991] pointer-events-none rounded-full"
            style={{
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
              boxShadow: `0 0 0 1px oklch(1 0 0 / 0.15), 0 0 40px oklch(0.74 0.15 222 / 0.15)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9995] flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 backdrop-blur-xl ring-1 ring-white/[0.1]"
          >
            <span className="text-[11px] text-white/60">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50">Alt+S</kbd>
              {" "}Spotlight ·{" "}
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50">Alt+Z</kbd>
              {" "}Zoom · scroll to resize
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicator */}
      {spotlightActive && (
        <div className="fixed top-4 right-4 z-[9995] flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-xl ring-1 ring-white/[0.08]">
          {isSpotlight
            ? <Crosshair className="h-3.5 w-3.5 text-primary/70" />
            : <ZoomIn className="h-3.5 w-3.5 text-primary/70" />}
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
            {isSpotlight ? "Spotlight" : "Zoom"} · Alt+{isSpotlight ? "S" : "Z"} to exit
          </span>
        </div>
      )}
    </>
  );
}
