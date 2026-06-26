import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Square, Mic, MicOff, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimer } from "@/lib/recording-utils";

interface FloatingMiniBarProps {
  status: string;
  elapsed: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  audioLevel?: number;
}

export function FloatingMiniBar({
  status,
  elapsed,
  onPause,
  onResume,
  onStop,
  audioLevel = 0,
}: FloatingMiniBarProps) {
  const [pos, setPos] = useState({ x: 50, y: 94 }); // % of screen
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const visible = isRecording || isPaused;

  const handleDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    const onMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - dragStart.current.mx) / window.innerWidth) * 100;
      const dy = ((ev.clientY - dragStart.current.my) / window.innerHeight) * 100;
      setPos({
        x: Math.max(5, Math.min(95, dragStart.current.px + dx)),
        y: Math.max(5, Math.min(95, dragStart.current.py + dy)),
      });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="mini-bar"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="fixed z-[9980] select-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Glow halo */}
        <div
          className={cn(
            "absolute -inset-3 rounded-full blur-xl transition-all duration-500 pointer-events-none",
            isRecording ? "bg-red-500/15" : "bg-yellow-500/12",
          )}
        />

        <div
          className={cn(
            "relative flex items-center gap-2 rounded-full backdrop-blur-2xl ring-1 transition-all duration-300 shadow-2xl",
            isRecording
              ? "bg-red-950/80 ring-red-500/25 pr-3 pl-2"
              : "bg-yellow-950/80 ring-yellow-500/25 pr-3 pl-2",
            "py-2",
          )}
        >
          {/* Drag handle */}
          <div
            onMouseDown={handleDown}
            className={cn(
              "flex h-6 w-6 cursor-grab active:cursor-grabbing items-center justify-center rounded-full transition-colors",
              isRecording ? "text-red-400/60 hover:text-red-300" : "text-yellow-400/60 hover:text-yellow-300",
            )}
            title="Drag to move"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="3" cy="2" r="1" />
              <circle cx="7" cy="2" r="1" />
              <circle cx="3" cy="5" r="1" />
              <circle cx="7" cy="5" r="1" />
              <circle cx="3" cy="8" r="1" />
              <circle cx="7" cy="8" r="1" />
            </svg>
          </div>

          {/* Recording indicator */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {isRecording && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                isRecording ? "bg-red-400" : "bg-yellow-300",
              )}
            />
          </span>

          {/* Timer */}
          <span className={cn(
            "font-mono text-sm tabular-nums font-semibold tracking-wider",
            isRecording ? "text-red-200" : "text-yellow-200",
          )}>
            {formatTimer(elapsed)}
          </span>

          {/* Audio mini-meter */}
          {isRecording && (
            <div className="flex items-end gap-[1.5px] h-4">
              {Array.from({ length: 8 }).map((_, i) => {
                const t = Math.abs(i - 3.5) / 3.5;
                const h = Math.max(2, audioLevel * 14 * (1 - t * 0.4));
                return (
                  <div
                    key={i}
                    className="w-[2px] rounded-full bg-red-400/60 transition-all duration-75"
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>
          )}

          {/* Divider */}
          <div className={cn("h-5 w-px", isRecording ? "bg-red-400/20" : "bg-yellow-400/20")} />

          {/* Controls */}
          <div className="flex items-center gap-1">
            {isRecording ? (
              <button
                onClick={onPause}
                className="flex h-7 w-7 items-center justify-center rounded-full text-red-300/70 transition-all hover:bg-red-400/15 hover:text-red-200"
                title="Pause (Space)"
              >
                <Pause className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={onResume}
                className="flex h-7 w-7 items-center justify-center rounded-full text-yellow-300/70 transition-all hover:bg-yellow-400/15 hover:text-yellow-200"
                title="Resume (Space)"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </button>
            )}
            <button
              onClick={onStop}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition-all",
                isRecording
                  ? "text-red-300/70 hover:bg-red-400/15 hover:text-red-200"
                  : "text-yellow-300/70 hover:bg-yellow-400/15 hover:text-yellow-200",
              )}
              title="Stop (Escape)"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
