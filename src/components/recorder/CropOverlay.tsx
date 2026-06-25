import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { CropRect } from "@/hooks/use-screen-recorder";

interface CropOverlayProps {
  stream: MediaStream | null;
  onConfirm: (rect: CropRect) => void;
  onCancel: () => void;
}

export function CropOverlay({ stream, onConfirm, onCancel }: CropOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [selection, setSelection] = useState<CropRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<"nw" | "ne" | "sw" | "se" | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, rect: { x: 0, y: 0, w: 0, h: 0 } });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const getOverlayRect = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return { left: 0, top: 0, width: 1, height: 1 };
    return el.getBoundingClientRect();
  }, []);

  const clientToRect = useCallback(
    (cx: number, cy: number) => {
      const r = getOverlayRect();
      return { x: cx - r.left, y: cy - r.top };
    },
    [getOverlayRect],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (resizing) return;
      const pos = clientToRect(e.clientX, e.clientY);
      setIsDragging(true);
      setDragStart(pos);
      setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
    },
    [clientToRect, resizing],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (resizing) {
        const pos = clientToRect(e.clientX, e.clientY);
        let { x, y, w, h } = resizeStart.rect;
        const dx = pos.x - resizeStart.x;
        const dy = pos.y - resizeStart.y;
        if (resizing === "se") {
          w = Math.max(50, resizeStart.rect.w + dx);
          h = Math.max(50, resizeStart.rect.h + dy);
        }
        if (resizing === "sw") {
          x = resizeStart.rect.x + dx;
          w = Math.max(50, resizeStart.rect.w - dx);
          h = Math.max(50, resizeStart.rect.h + dy);
        }
        if (resizing === "ne") {
          y = resizeStart.rect.y + dy;
          w = Math.max(50, resizeStart.rect.w + dx);
          h = Math.max(50, resizeStart.rect.h - dy);
        }
        if (resizing === "nw") {
          x = resizeStart.rect.x + dx;
          y = resizeStart.rect.y + dy;
          w = Math.max(50, resizeStart.rect.w - dx);
          h = Math.max(50, resizeStart.rect.h - dy);
        }
        setSelection({ x, y, width: w, height: h });
        return;
      }

      if (!isDragging) return;
      const pos = clientToRect(e.clientX, e.clientY);
      const x = Math.min(dragStart.x, pos.x);
      const y = Math.min(dragStart.y, pos.y);
      const width = Math.abs(pos.x - dragStart.x);
      const height = Math.abs(pos.y - dragStart.y);
      setSelection({ x, y, width, height });
    },
    [isDragging, dragStart, clientToRect, resizing, resizeStart],
  );

  const handleMouseUp = useCallback(() => {
    if (resizing) {
      setResizing(null);
      return;
    }
    setIsDragging(false);
    if (selection && (selection.width < 50 || selection.height < 50)) {
      setSelection(null);
    }
  }, [resizing, selection]);

  const handleResizeStart = useCallback(
    (dir: "nw" | "ne" | "sw" | "se") => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!selection) return;
      setResizing(dir);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        rect: { x: selection.x, y: selection.y, w: selection.width, h: selection.height },
      });
    },
    [selection],
  );

  const videoW = stream?.getVideoTracks()[0]?.getSettings().width ?? 1920;
  const videoH = stream?.getVideoTracks()[0]?.getSettings().height ?? 1080;

  const handleConfirm = () => {
    if (!selection || selection.width < 50 || selection.height < 50) return;
    const el = overlayRef.current;
    if (!el) return;
    const vr = el.getBoundingClientRect();
    const scaleX = videoW / vr.width;
    const scaleY = videoH / vr.height;
    onConfirm({
      x: Math.round(selection.x * scaleX),
      y: Math.round(selection.y * scaleY),
      width: Math.round(selection.width * scaleX),
      height: Math.round(selection.height * scaleY),
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm select-none">
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-contain opacity-40 pointer-events-none"
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm font-medium text-white/70">Select the area to record</span>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="rounded bg-white/[0.06] px-2 py-1">
              {videoW}×{videoH}
            </span>
          </div>
        </div>

        <div
          ref={overlayRef}
          className="relative flex-1 overflow-hidden cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <AnimatePresence>
            {selection && selection.width > 0 && selection.height > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute"
                style={{
                  left: selection.x,
                  top: selection.y,
                  width: selection.width,
                  height: selection.height,
                }}
              >
                <div
                  className="absolute inset-0 border-2 border-white/80 rounded-lg"
                  style={{
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                  }}
                />
                <div className="absolute -top-8 left-0 rounded bg-white/10 px-2 py-0.5 text-xs text-white/70 backdrop-blur-sm font-mono tabular-nums">
                  {Math.round(
                    selection.width *
                      (videoW / (overlayRef.current?.getBoundingClientRect().width ?? 1)),
                  )}{" "}
                  ×{" "}
                  {Math.round(
                    selection.height *
                      (videoH / (overlayRef.current?.getBoundingClientRect().height ?? 1)),
                  )}
                </div>
                {!isDragging && (
                  <>
                    <div
                      className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-white bg-white/20 cursor-nw-resize"
                      onMouseDown={handleResizeStart("nw")}
                    />
                    <div
                      className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-white bg-white/20 cursor-ne-resize"
                      onMouseDown={handleResizeStart("ne")}
                    />
                    <div
                      className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-white bg-white/20 cursor-sw-resize"
                      onMouseDown={handleResizeStart("sw")}
                    />
                    <div
                      className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-white bg-white/20 cursor-se-resize"
                      onMouseDown={handleResizeStart("se")}
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/60 ring-1 ring-white/[0.08] backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:text-white/80"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selection || selection.width < 50 || selection.height < 50}
            className="flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.4)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
