import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown, Play, Pause, RotateCcw, AlignCenter } from "lucide-react";

interface TeleprompterOverlayProps {
  active: boolean;
  onClose: () => void;
  isRecording: boolean;
}

const DEFAULT_TEXT = "";

export function TeleprompterOverlay({ active, onClose, isRecording }: TeleprompterOverlayProps) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [fontSize, setFontSize] = useState(28);
  const [speed, setSpeed] = useState(40); // px per second
  const [scrolling, setScrolling] = useState(false);
  const [editing, setEditing] = useState(true);
  const [opacity, setOpacity] = useState(85);
  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Auto-start scrolling when recording begins
  useEffect(() => {
    if (isRecording && active && !editing) {
      setScrolling(true);
    }
    if (!isRecording) {
      setScrolling(false);
    }
  }, [isRecording, active, editing]);

  // Scroll animation
  useEffect(() => {
    if (!scrolling || !scrollRef.current) return;
    const el = scrollRef.current;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      posRef.current += speed * dt;
      if (posRef.current >= el.scrollHeight - el.clientHeight) {
        posRef.current = el.scrollHeight - el.clientHeight;
        setScrolling(false);
      }
      el.scrollTop = posRef.current;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrolling, speed]);

  const reset = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    posRef.current = 0;
    setScrolling(false);
  }, []);

  const nudge = useCallback((dir: "up" | "down") => {
    if (!scrollRef.current) return;
    const delta = dir === "up" ? -80 : 80;
    posRef.current = Math.max(0, posRef.current + delta);
    scrollRef.current.scrollTop = posRef.current;
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="teleprompter"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="fixed inset-x-0 top-0 z-[9950] flex flex-col"
        style={{ height: "45vh" }}
      >
        {/* Main teleprompter area */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ backgroundColor: `oklch(0 0 0 / ${opacity / 100})` }}
        >
          {/* Gradient fade top + bottom */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Reading guide line */}
          <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: "40%" }}>
            <div className="mx-auto h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {editing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-full w-full resize-none bg-transparent px-16 py-8 text-center font-display font-semibold text-white/80 outline-none placeholder:text-white/20"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
              placeholder="Type or paste your script here..."
            />
          ) : (
            <div
              ref={scrollRef}
              className="h-full overflow-hidden px-16 py-8"
              style={{ scrollBehavior: "auto" }}
            >
              <div
                className="text-center font-display font-semibold text-white/85 whitespace-pre-wrap leading-relaxed mx-auto max-w-3xl"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              >
                {text}
              </div>
            </div>
          )}
        </div>

        {/* Control bar */}
        <div className="flex items-center gap-3 bg-black/90 px-4 py-2.5 backdrop-blur-xl border-t border-white/[0.06] flex-wrap">
          {/* Close */}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-5 w-px bg-white/[0.08]" />

          {/* Edit / preview toggle */}
          <button
            onClick={() => { setEditing(!editing); if (editing) reset(); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              editing
                ? "bg-primary/15 text-primary/80 ring-1 ring-primary/25"
                : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
            }`}
          >
            {editing ? "Preview script" : "Edit script"}
          </button>

          {!editing && (
            <>
              <div className="h-5 w-px bg-white/[0.08]" />

              {/* Scroll controls */}
              <button onClick={reset} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => nudge("up")} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button onClick={() => nudge("down")} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setScrolling(!scrolling)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  scrolling
                    ? "bg-primary/15 text-primary/80 ring-1 ring-primary/25"
                    : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
                }`}
              >
                {scrolling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {scrolling ? "Pause" : "Scroll"}
              </button>
            </>
          )}

          <div className="h-5 w-px bg-white/[0.08]" />

          {/* Font size */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/25 uppercase tracking-wider">Size</span>
            <input
              type="range" min={18} max={60} step={2} value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 h-1 accent-primary/70"
            />
            <span className="font-mono text-[10px] text-white/30 w-6">{fontSize}</span>
          </div>

          {/* Speed */}
          {!editing && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25 uppercase tracking-wider">Speed</span>
              <input
                type="range" min={10} max={120} step={5} value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 h-1 accent-primary/70"
              />
              <span className="font-mono text-[10px] text-white/30 w-6">{speed}</span>
            </div>
          )}

          {/* Opacity */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-white/25 uppercase tracking-wider">Opacity</span>
            <input
              type="range" min={40} max={100} step={5} value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 h-1 accent-primary/70"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
