import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Move, Crop, MousePointer2, Keyboard } from "lucide-react";
import type { CropRect } from "@/hooks/use-screen-recorder";

interface CropOverlayProps {
  stream: MediaStream | null;
  onConfirm: (rect: CropRect) => void;
  onCancel: () => void;
}

const MIN_SIZE = 80;
const HANDLE_SIZE = 10;
const HANDLE_OFFSET = HANDLE_SIZE / 2;

type Edge = "n" | "s" | "e" | "w";
type Corner = "nw" | "ne" | "sw" | "se";
type Handle = Edge | Corner;

const HANDLE_CURSOR: Record<Handle, string> = {
  n: "cursor-n-resize",
  s: "cursor-s-resize",
  e: "cursor-e-resize",
  w: "cursor-w-resize",
  nw: "cursor-nw-resize",
  ne: "cursor-ne-resize",
  sw: "cursor-sw-resize",
  se: "cursor-se-resize",
};

export function CropOverlay({ stream, onConfirm, onCancel }: CropOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [selection, setSelection] = useState<CropRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState({ x: 0, y: 0, rx: 0, ry: 0 });
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, rect: { x: 0, y: 0, w: 0, h: 0 } });
  const [step, setStep] = useState<"draw" | "adjust">("draw");
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  useEffect(() => {
    if (selection && step === "draw") {
      setStep("adjust");
    }
  }, [selection, step]);

  // Hide hints after 4s
  useEffect(() => {
    if (!showHints) return;
    const t = setTimeout(() => setShowHints(false), 4000);
    return () => clearTimeout(t);
  }, [showHints]);

  const getOverlayRect = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return { left: 0, top: 0, width: 1, height: 1 };
    return el.getBoundingClientRect();
  }, []);

  const clientToOverlay = useCallback(
    (cx: number, cy: number) => {
      const r = getOverlayRect();
      return { x: cx - r.left, y: cy - r.top };
    },
    [getOverlayRect],
  );

  const constrainRect = useCallback((rect: CropRect, bounds: { w: number; h: number }) => {
    let { x, y, width, height } = rect;
    if (width < MIN_SIZE) width = MIN_SIZE;
    if (height < MIN_SIZE) height = MIN_SIZE;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + width > bounds.w) x = bounds.w - width;
    if (y + height > bounds.h) y = bounds.h - height;
    if (x < 0) {
      x = 0;
      width = bounds.w;
    }
    if (y < 0) {
      y = 0;
      height = bounds.h;
    }
    return { x, y, width, height };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pos = clientToOverlay(e.clientX, e.clientY);

      // Check if we clicked inside an existing selection (for moving)
      if (selection && !activeHandle) {
        const s = selection;
        if (pos.x >= s.x && pos.x <= s.x + s.width && pos.y >= s.y && pos.y <= s.y + s.height) {
          setIsMoving(true);
          setMoveStart({ x: e.clientX, y: e.clientY, rx: s.x, ry: s.y });
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          return;
        }
      }

      // Start new drag selection
      setIsDragging(true);
      setDragStart(pos);
      setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [clientToOverlay, selection, activeHandle],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeHandle) {
        const pos = clientToOverlay(e.clientX, e.clientY);
        const bounds = getOverlayRect();
        let { x, y, w, h } = resizeStart.rect;
        const dx = pos.x - resizeStart.x;
        const dy = pos.y - resizeStart.y;

        switch (activeHandle) {
          case "se":
            w = resizeStart.rect.w + dx;
            h = resizeStart.rect.h + dy;
            break;
          case "sw":
            x = resizeStart.rect.x + dx;
            w = resizeStart.rect.w - dx;
            h = resizeStart.rect.h + dy;
            break;
          case "ne":
            y = resizeStart.rect.y + dy;
            w = resizeStart.rect.w + dx;
            h = resizeStart.rect.h - dy;
            break;
          case "nw":
            x = resizeStart.rect.x + dx;
            y = resizeStart.rect.y + dy;
            w = resizeStart.rect.w - dx;
            h = resizeStart.rect.h - dy;
            break;
          case "n":
            y = resizeStart.rect.y + dy;
            h = resizeStart.rect.h - dy;
            break;
          case "s":
            h = resizeStart.rect.h + dy;
            break;
          case "w":
            x = resizeStart.rect.x + dx;
            w = resizeStart.rect.w - dx;
            break;
          case "e":
            w = resizeStart.rect.w + dx;
            break;
        }

        setSelection(
          constrainRect({ x, y, width: w, height: h }, { w: bounds.width, h: bounds.height }),
        );
        return;
      }

      if (isMoving) {
        const pos = clientToOverlay(e.clientX, e.clientY);
        const bounds = getOverlayRect();
        const startPos = clientToOverlay(moveStart.x, moveStart.y);
        const dx = pos.x - startPos.x;
        const dy = pos.y - startPos.y;
        setSelection(
          constrainRect(
            {
              x: moveStart.rx + dx,
              y: moveStart.ry + dy,
              width: selection!.width,
              height: selection!.height,
            },
            { w: bounds.width, h: bounds.height },
          ),
        );
        return;
      }

      if (!isDragging) return;
      const pos = clientToOverlay(e.clientX, e.clientY);
      const x = Math.min(dragStart.x, pos.x);
      const y = Math.min(dragStart.y, pos.y);
      const width = Math.abs(pos.x - dragStart.x);
      const height = Math.abs(pos.y - dragStart.y);
      setSelection({ x, y, width, height });
    },
    [
      isDragging,
      isMoving,
      dragStart,
      moveStart,
      clientToOverlay,
      getOverlayRect,
      activeHandle,
      resizeStart,
      selection,
      constrainRect,
    ],
  );

  const handlePointerUp = useCallback(() => {
    if (activeHandle) {
      setActiveHandle(null);
      return;
    }
    if (isMoving) {
      setIsMoving(false);
      return;
    }
    setIsDragging(false);
    if (selection && (selection.width < MIN_SIZE || selection.height < MIN_SIZE)) {
      setSelection(null);
    }
  }, [activeHandle, isMoving, selection]);

  const handleResizeStart = useCallback(
    (handle: Handle) => (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!selection) return;
      setActiveHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        rect: { x: selection.x, y: selection.y, w: selection.width, h: selection.height },
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [selection],
  );

  const videoW = stream?.getVideoTracks()[0]?.getSettings().width ?? 1920;
  const videoH = stream?.getVideoTracks()[0]?.getSettings().height ?? 1080;

  const handleConfirm = () => {
    if (!selection || selection.width < MIN_SIZE || selection.height < MIN_SIZE) return;
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

  const hasValidSelection =
    selection && selection.width >= MIN_SIZE && selection.height >= MIN_SIZE;

  // Compute recorded resolution for display
  const overlayRect = overlayRef.current?.getBoundingClientRect();
  const recordedW = overlayRect
    ? Math.round(selection ? selection.width * (videoW / overlayRect.width) : videoW)
    : videoW;
  const recordedH = overlayRect
    ? Math.round(selection ? selection.height * (videoH / overlayRect.height) : videoH)
    : videoH;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/70 select-none">
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-contain opacity-30 pointer-events-none"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Step indicator */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-8">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === "draw"
                    ? "bg-white text-black scale-110 shadow-[0_0_20px_-4px_rgba(255,255,255,0.3)]"
                    : "bg-white/[0.06] text-white/40"
                }`}
              >
                1
              </span>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold transition-colors ${
                    step === "draw" ? "text-white" : "text-white/30"
                  }`}
                >
                  Draw area
                </span>
                <span className="text-[10px] text-white/25">Click & drag on the preview</span>
              </div>
            </div>
            {/* Connector line */}
            <div className="h-px w-12 bg-white/[0.08]" />
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === "adjust"
                    ? "bg-white text-black scale-110 shadow-[0_0_20px_-4px_rgba(255,255,255,0.3)]"
                    : "bg-white/[0.06] text-white/40"
                }`}
              >
                2
              </span>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold transition-colors ${
                    step === "adjust" ? "text-white" : "text-white/30"
                  }`}
                >
                  Adjust
                </span>
                <span className="text-[10px] text-white/25">
                  Drag edges or corners to fine-tune
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-white/50 ring-1 ring-white/[0.06]">
              Source: {videoW}×{videoH}
            </div>
          </div>
        </div>

        {/* Crop canvas */}
        <div
          ref={overlayRef}
          className="relative flex-1 overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          {/* Selection */}
          <AnimatePresence>
            {selection && (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="absolute"
                style={{
                  left: selection.x,
                  top: selection.y,
                  width: selection.width,
                  height: selection.height,
                  cursor: isDragging || activeHandle ? "default" : "move",
                }}
              >
                {/* Highlighted area */}
                <div className="absolute inset-0 rounded-lg">
                  {/* Border */}
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      border: "2px solid rgba(255,255,255,0.9)",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3), 0 0 0 9999px rgba(0,0,0,0.6)",
                    }}
                  />
                  {/* Subtle grid overlay */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none opacity-20"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <line x1="33.3" y1="0" x2="33.3" y2="100" stroke="white" strokeWidth="0.5" />
                    <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="white" strokeWidth="0.5" />
                    <line x1="0" y1="33.3" x2="100" y2="33.3" stroke="white" strokeWidth="0.5" />
                    <line x1="0" y1="66.6" x2="100" y2="66.6" stroke="white" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Info badge */}
                <AnimatePresence>
                  {!isDragging && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute -top-9 left-0 flex items-center gap-2"
                    >
                      <div className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-mono text-white/80 backdrop-blur-sm ring-1 ring-white/[0.12]">
                        {recordedW} × {recordedH}
                      </div>
                      <div className="rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/50 backdrop-blur-sm ring-1 ring-white/[0.08]">
                        {selection.width >= MIN_SIZE && selection.height >= MIN_SIZE
                          ? (recordedW / recordedH).toFixed(2)
                          : "-"}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resize handles — shown when not actively dragging a new selection */}
                {!isDragging && (
                  <>
                    {/* Corner handles */}
                    {(["nw", "ne", "sw", "se"] as const).map((dir) => (
                      <div
                        key={dir}
                        onPointerDown={handleResizeStart(dir)}
                        className={`absolute z-10 ${HANDLE_CURSOR[dir]} flex items-center justify-center`}
                        style={{
                          width: HANDLE_SIZE + 6,
                          height: HANDLE_SIZE + 6,
                          [dir.includes("n") ? "top" : "bottom"]: -HANDLE_OFFSET - 3,
                          [dir.includes("w") ? "left" : "right"]: -HANDLE_OFFSET - 3,
                        }}
                      >
                        <div className="h-full w-full rounded-full border-2 border-white bg-white/90 shadow-lg" />
                      </div>
                    ))}
                    {/* Edge handles */}
                    {(["n", "s", "e", "w"] as const).map((dir) => (
                      <div
                        key={dir}
                        onPointerDown={handleResizeStart(dir)}
                        className={`absolute z-10 ${HANDLE_CURSOR[dir]} flex items-center justify-center`}
                        style={{
                          width: dir === "e" || dir === "w" ? HANDLE_SIZE + 16 : HANDLE_SIZE - 4,
                          height: dir === "n" || dir === "s" ? HANDLE_SIZE + 16 : HANDLE_SIZE - 4,
                          ...(dir === "n"
                            ? { top: -2, left: "50%", transform: "translateX(-50%)" }
                            : {}),
                          ...(dir === "s"
                            ? { bottom: -2, left: "50%", transform: "translateX(-50%)" }
                            : {}),
                          ...(dir === "e"
                            ? { right: -2, top: "50%", transform: "translateY(-50%)" }
                            : {}),
                          ...(dir === "w"
                            ? { left: -2, top: "50%", transform: "translateY(-50%)" }
                            : {}),
                        }}
                      >
                        <div
                          className="rounded-full bg-white/60 ring-1 ring-white/30"
                          style={{
                            width: dir === "e" || dir === "w" ? 6 : 4,
                            height: dir === "n" || dir === "s" ? 6 : 4,
                          }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step hints overlay */}
          <AnimatePresence>
            {showHints && !selection && (
              <motion.div
                key="hints"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/50 px-8 py-6 backdrop-blur-md ring-1 ring-white/[0.08]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
                    <MousePointer2 className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/80">
                      Click & drag to select an area
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Drag the edges or corners to fine-tune
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center gap-6 px-8 py-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/50 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.1] hover:text-white/80"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {selection && (
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/40 ring-1 ring-white/[0.06]">
                <Move className="h-3 w-3" />
                <span>
                  {recordedW}×{recordedH} @ {Math.round((recordedW * recordedH * 30) / 1_000_000)}{" "}
                  Mbps
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!hasValidSelection}
              className="flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.4)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Crop className="h-4 w-4" />
              {hasValidSelection ? "Start Recording" : "Select an area first"}
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-3 py-2 text-[10px] text-white/20 ring-1 ring-white/[0.06]">
            <Keyboard className="h-3 w-3" />
            <span>Esc to cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
