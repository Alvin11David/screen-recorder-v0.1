import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CameraSettings, CameraShape } from "@/hooks/use-screen-recorder";

interface CameraOverlayProps {
  cameraStream: MediaStream | null;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  settings: CameraSettings;
  onSettingsChange: (s: CameraSettings) => void;
  active: boolean;
}

export function CameraOverlay({
  cameraStream,
  position,
  onPositionChange,
  settings,
  onSettingsChange,
  active,
}: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [showEnhancers, setShowEnhancers] = useState(false);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream]);

  const handleDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY, px: position.x, py: position.y };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ((ev.clientX - dragStart.current.x) / window.innerWidth) * 100;
        const dy = ((ev.clientY - dragStart.current.y) / window.innerHeight) * 100;
        onPositionChange({
          x: Math.max(5, Math.min(95, dragStart.current.px + dx)),
          y: Math.max(5, Math.min(95, dragStart.current.py + dy)),
        });
      };
      const onUp = () => {
        dragRef.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [position, onPositionChange],
  );

  if (!active || !cameraStream) return null;

  const r = settings.radius;

  const shapeRadius: Record<CameraShape, string> = {
    circle: "50%",
    square: "0%",
    rounded: "20%",
  };

  const shapeClipClass: Record<CameraShape, string> = {
    circle: "rounded-full",
    square: "",
    rounded: "rounded-[20%]",
  };

  return (
    <>
      {/* ── Draggable camera bubble ── */}
      <div
        className="fixed z-50"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          width: r * 2,
          height: r * 2,
        }}
      >
        <div
          onMouseDown={handleDown}
          className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
        >
          {/* Camera feed clipped to circle */}
          <div
            className="h-full w-full overflow-hidden"
            style={{ borderRadius: "50%" }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              className={cn(
                "h-full w-full object-cover",
                settings.mirrored && "scale-x-[-1]",
              )}
            />
          </div>

          {/* Border ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 0 ${settings.borderWidth}px ${settings.borderColor}, 0 0 ${settings.shadowBlur}px rgba(255,255,255,0.2)`,
            }}
          />

          {/* Drag handle indicator */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm ring-1 ring-white/[0.1]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/50">
              <circle cx="4" cy="2" r="1" fill="currentColor" />
              <circle cx="8" cy="2" r="1" fill="currentColor" />
              <circle cx="4" cy="6" r="1" fill="currentColor" />
              <circle cx="8" cy="6" r="1" fill="currentColor" />
              <circle cx="4" cy="10" r="1" fill="currentColor" />
              <circle cx="8" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* ── Enhancers toggle ── */}
        <div className="absolute -top-1 right-0">
          <button
            type="button"
            onClick={() => setShowEnhancers(!showEnhancers)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/60 backdrop-blur-sm ring-1 ring-white/[0.1] transition-all hover:bg-white/[0.1] hover:text-white/90"
            title="Camera settings"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="2.5" />
              <path d="M8 2v1.5M8 12.5V14M14 8h-1.5M3.5 8H2M12.1 3.9l-1.1 1.1M5 11l-1.1 1.1M12.1 12.1l-1.1-1.1M5 5L3.9 3.9" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Enhancers panel ── */}
      <AnimatePresence>
        {showEnhancers && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 rounded-2xl bg-black/70 px-5 py-3 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl"
          >
            {/* Mirror */}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-white/60 select-none">
              <input
                type="checkbox"
                checked={settings.mirrored}
                onChange={() => onSettingsChange({ ...settings, mirrored: !settings.mirrored })}
                className="h-3.5 w-3.5 accent-white/50 rounded"
              />
              Mirror
            </label>

            <div className="h-6 w-px bg-white/[0.06]" />

            {/* Border width */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Border</span>
              <input
                type="range"
                min={0}
                max={6}
                step={1}
                value={settings.borderWidth}
                onChange={(e) => onSettingsChange({ ...settings, borderWidth: Number(e.target.value) })}
                className="w-16 h-1 accent-white/50"
              />
            </div>

            <div className="h-6 w-px bg-white/[0.06]" />

            {/* Shadow */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Glow</span>
              <input
                type="range"
                min={0}
                max={40}
                step={2}
                value={settings.shadowBlur}
                onChange={(e) => onSettingsChange({ ...settings, shadowBlur: Number(e.target.value) })}
                className="w-16 h-1 accent-white/50"
              />
            </div>

            <div className="h-6 w-px bg-white/[0.06]" />

            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Size</span>
              <input
                type="range"
                min={40}
                max={120}
                step={5}
                value={settings.radius}
                onChange={(e) => onSettingsChange({ ...settings, radius: Number(e.target.value) })}
                className="w-16 h-1 accent-white/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
