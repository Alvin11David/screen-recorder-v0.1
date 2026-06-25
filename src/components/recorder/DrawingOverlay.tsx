import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pencil,
  Highlighter,
  Eraser,
  Undo2,
  Trash2,
  Minus,
  Square,
  Circle,
  ArrowUpRight,
  Type,
  Diamond,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tool =
  | "pen"
  | "highlighter"
  | "eraser"
  | "line"
  | "arrow"
  | "rect"
  | "circle"
  | "fill-rect"
  | "fill-circle"
  | "diamond"
  | "star"
  | "text";

const COLORS = [
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const TOOLS: { id: Tool; icon: typeof Pencil; label: string }[] = [
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "arrow", icon: ArrowUpRight, label: "Arrow" },
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "fill-rect", icon: Square, label: "Filled Rect" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "fill-circle", icon: Circle, label: "Filled Circle" },
  { id: "diamond", icon: Diamond, label: "Diamond" },
  { id: "star", icon: Star, label: "Star" },
  { id: "text", icon: Type, label: "Text" },
];

interface DrawingOverlayProps {
  enabled: boolean;
  annotationCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  recordingWidth: number;
  recordingHeight: number;
  onClear: () => void;
}

export function DrawingOverlay({
  enabled,
  annotationCanvasRef,
  recordingWidth,
  recordingHeight,
  onClear,
}: DrawingOverlayProps) {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const undoStack = useRef<ImageData[]>([]);
  const startPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(3);
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    displayX: number;
    displayY: number;
    value: string;
  } | null>(null);
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const colorRef = useRef(color);
  colorRef.current = color;
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // ── Scale helpers ──
  const toRecording = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: ((clientX - r.left) / r.width) * recordingWidth,
        y: ((clientY - r.top) / r.height) * recordingHeight,
      };
    },
    [recordingWidth, recordingHeight],
  );

  const syncDisplay = useCallback(() => {
    const ac = annotationCanvasRef.current;
    const dc = displayCanvasRef.current;
    const el = containerRef.current;
    if (!ac || !dc || !el) return;
    const r = el.getBoundingClientRect();
    dc.width = Math.round(r.width);
    dc.height = Math.round(r.height);
    const dctx = dc.getContext("2d")!;
    dctx.clearRect(0, 0, dc.width, dc.height);
    dctx.drawImage(ac, 0, 0, dc.width, dc.height);
  }, [annotationCanvasRef]);

  // Save undo snapshot
  const saveSnapshot = useCallback(() => {
    const ac = annotationCanvasRef.current;
    if (!ac) return;
    const ctx = ac.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, ac.width, ac.height);
    undoStack.current.push(data);
    if (undoStack.current.length > 30) undoStack.current.shift();
  }, [annotationCanvasRef]);

  // Restore last snapshot
  const handleUndo = useCallback(() => {
    const ac = annotationCanvasRef.current;
    if (!ac) return;
    const ctx = ac.getContext("2d");
    if (!ctx) return;
    const prev = undoStack.current.pop();
    if (!prev) {
      ctx.clearRect(0, 0, ac.width, ac.height);
      syncDisplay();
      return;
    }
    ctx.putImageData(prev, 0, 0);
    syncDisplay();
  }, [annotationCanvasRef, syncDisplay]);

  // ── Drawing actions ──
  const drawOnAnnotation = useCallback(
    (drawFn: (ctx: CanvasRenderingContext2D) => void) => {
      const ac = annotationCanvasRef.current;
      if (!ac) return;
      const ctx = ac.getContext("2d");
      if (!ctx) return;
      ctx.save();
      drawFn(ctx);
      ctx.restore();
    },
    [annotationCanvasRef],
  );

  const getCtxProps = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = toolRef.current;
    if (t === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = sizeRef.current * 8;
    } else if (t === "highlighter") {
      ctx.strokeStyle = colorRef.current;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = sizeRef.current * 4;
    } else {
      ctx.strokeStyle = colorRef.current;
      ctx.globalAlpha = 1;
      ctx.lineWidth = sizeRef.current;
    }
  }, []);

  // ── Mouse handlers ──
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();

      const t = toolRef.current;

      // ── Text tool opens an inline input ──
      if (t === "text") {
        const el = containerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setTextInput({
          x: toRecording(e.clientX, e.clientY).x,
          y: toRecording(e.clientX, e.clientY).y,
          displayX: e.clientX - r.left,
          displayY: e.clientY - r.top,
          value: "",
        });
        return;
      }

      drawing.current = true;
      const pos = toRecording(e.clientX, e.clientY);
      startPos.current = pos;
      lastPos.current = pos;

      if (t === "pen" || t === "highlighter" || t === "eraser") {
        saveSnapshot();
        drawOnAnnotation((ctx) => {
          getCtxProps(ctx);
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
        });
      }
    },
    [enabled, toRecording, saveSnapshot, drawOnAnnotation, getCtxProps],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      const pos = toRecording(e.clientX, e.clientY);
      const t = toolRef.current;

      if (t === "pen" || t === "highlighter" || t === "eraser") {
        drawOnAnnotation((ctx) => {
          getCtxProps(ctx);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        });
        syncDisplay();
      } else {
        // Shape preview: redraw annotation canvas to display, then draw shape preview
        const ac = annotationCanvasRef.current;
        const dc = displayCanvasRef.current;
        const el = containerRef.current;
        if (!ac || !dc || !el) return;
        const r = el.getBoundingClientRect();
        const dctx = dc.getContext("2d")!;
        dctx.clearRect(0, 0, dc.width, dc.height);
        dctx.drawImage(ac, 0, 0, dc.width, dc.height);

        const sx = r.width / recordingWidth;
        const sy = r.height / recordingHeight;
        const x1 = startPos.current.x * sx;
        const y1 = startPos.current.y * sy;
        const x2 = pos.x * sx;
        const y2 = pos.y * sy;

        dctx.save();
        dctx.strokeStyle = colorRef.current;
        dctx.globalAlpha = 1;
        dctx.lineWidth = sizeRef.current * sx;
        dctx.lineCap = "round";
        dctx.lineJoin = "round";

        switch (t) {
          case "line":
            dctx.beginPath();
            dctx.moveTo(x1, y1);
            dctx.lineTo(x2, y2);
            dctx.stroke();
            break;
          case "arrow": {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLen = 12 * sx;
            dctx.beginPath();
            dctx.moveTo(x1, y1);
            dctx.lineTo(x2, y2);
            dctx.stroke();
            dctx.beginPath();
            dctx.moveTo(x2, y2);
            dctx.lineTo(
              x2 - headLen * Math.cos(angle - Math.PI / 6),
              y2 - headLen * Math.sin(angle - Math.PI / 6),
            );
            dctx.moveTo(x2, y2);
            dctx.lineTo(
              x2 - headLen * Math.cos(angle + Math.PI / 6),
              y2 - headLen * Math.sin(angle + Math.PI / 6),
            );
            dctx.stroke();
            break;
          }
          case "rect":
          case "fill-rect":
            dctx.strokeRect(
              Math.min(x1, x2),
              Math.min(y1, y2),
              Math.abs(x2 - x1),
              Math.abs(y2 - y1),
            );
            if (t === "fill-rect") {
              dctx.fillStyle = colorRef.current;
              dctx.globalAlpha = 0.3;
              dctx.fillRect(
                Math.min(x1, x2),
                Math.min(y1, y2),
                Math.abs(x2 - x1),
                Math.abs(y2 - y1),
              );
            }
            break;
          case "circle":
          case "fill-circle": {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            dctx.beginPath();
            dctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            dctx.stroke();
            if (t === "fill-circle") {
              dctx.fillStyle = colorRef.current;
              dctx.globalAlpha = 0.3;
              dctx.fill();
            }
            break;
          }
          case "diamond": {
            dctx.beginPath();
            dctx.moveTo((x1 + x2) / 2, y1);
            dctx.lineTo(x2, (y1 + y2) / 2);
            dctx.lineTo((x1 + x2) / 2, y2);
            dctx.lineTo(x1, (y1 + y2) / 2);
            dctx.closePath();
            dctx.stroke();
            break;
          }
          case "star": {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            const spikes = 5;
            const outerR = Math.min(rx, ry);
            const innerR = outerR * 0.4;
            dctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const r2 = i % 2 === 0 ? outerR : innerR;
              const a = (Math.PI * i) / spikes - Math.PI / 2;
              const px = cx + r2 * Math.cos(a);
              const py = cy + r2 * Math.sin(a);
              if (i === 0) dctx.moveTo(px, py);
              else dctx.lineTo(px, py);
            }
            dctx.closePath();
            dctx.stroke();
            break;
          }
        }
        dctx.restore();
      }

      lastPos.current = pos;
    },
    [
      toRecording,
      drawOnAnnotation,
      getCtxProps,
      syncDisplay,
      annotationCanvasRef,
      recordingWidth,
      recordingHeight,
    ],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing.current) return;
      drawing.current = false;
      const t = toolRef.current;

      if (t === "pen" || t === "highlighter" || t === "eraser") {
        // stroke already committed
        return;
      }

      // Commit shape
      const pos = toRecording(e.clientX, e.clientY);
      saveSnapshot();
      drawOnAnnotation((ctx) => {
        getCtxProps(ctx);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const x1 = startPos.current.x;
        const y1 = startPos.current.y;
        const x2 = pos.x;
        const y2 = pos.y;

        switch (t) {
          case "line":
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;
          case "arrow": {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLen = 12;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(
              x2 - headLen * Math.cos(angle - Math.PI / 6),
              y2 - headLen * Math.sin(angle - Math.PI / 6),
            );
            ctx.moveTo(x2, y2);
            ctx.lineTo(
              x2 - headLen * Math.cos(angle + Math.PI / 6),
              y2 - headLen * Math.sin(angle + Math.PI / 6),
            );
            ctx.stroke();
            break;
          }
          case "rect":
          case "fill-rect":
            ctx.strokeRect(
              Math.min(x1, x2),
              Math.min(y1, y2),
              Math.abs(x2 - x1),
              Math.abs(y2 - y1),
            );
            if (t === "fill-rect") {
              ctx.fillStyle = colorRef.current;
              ctx.globalAlpha = 0.3;
              ctx.fillRect(
                Math.min(x1, x2),
                Math.min(y1, y2),
                Math.abs(x2 - x1),
                Math.abs(y2 - y1),
              );
            }
            break;
          case "circle":
          case "fill-circle": {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            if (t === "fill-circle") {
              ctx.fillStyle = colorRef.current;
              ctx.globalAlpha = 0.3;
              ctx.fill();
            }
            break;
          }
          case "diamond": {
            ctx.beginPath();
            ctx.moveTo((x1 + x2) / 2, y1);
            ctx.lineTo(x2, (y1 + y2) / 2);
            ctx.lineTo((x1 + x2) / 2, y2);
            ctx.lineTo(x1, (y1 + y2) / 2);
            ctx.closePath();
            ctx.stroke();
            break;
          }
          case "star": {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            const spikes = 5;
            const outerR = Math.min(rx, ry);
            const innerR = outerR * 0.4;
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const r2 = i % 2 === 0 ? outerR : innerR;
              const a = (Math.PI * i) / spikes - Math.PI / 2;
              const px = cx + r2 * Math.cos(a);
              const py = cy + r2 * Math.sin(a);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
            break;
          }
        }
      });
      syncDisplay();
    },
    [toRecording, saveSnapshot, drawOnAnnotation, getCtxProps, syncDisplay],
  );

  // ── Commit text to annotation canvas ──
  const commitText = useCallback(
    (text: string, x: number, y: number) => {
      if (!text.trim()) return;
      saveSnapshot();
      drawOnAnnotation((ctx) => {
        ctx.save();
        ctx.font = `${sizeRef.current * 6}px sans-serif`;
        ctx.fillStyle = colorRef.current;
        ctx.globalAlpha = 1;
        ctx.textBaseline = "top";
        const lines = text.split("\n");
        const lineH = sizeRef.current * 7;
        lines.forEach((line, i) => {
          ctx.fillText(line, x, y + i * lineH);
        });
        ctx.restore();
      });
      syncDisplay();
    },
    [saveSnapshot, drawOnAnnotation, syncDisplay],
  );

  // Synce display on enable
  useEffect(() => {
    if (enabled) syncDisplay();
  }, [enabled, syncDisplay]);

  // Resize observer to keep display canvas synced
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const ro = new ResizeObserver(() => syncDisplay());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [enabled, syncDisplay]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[9997] pointer-events-none">
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-auto"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <canvas ref={displayCanvasRef} className="h-full w-full" />
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-2xl bg-black/70 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => setTool(id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                tool === id
                  ? "bg-white/[0.12] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}

          <div className="mx-1 h-6 w-px bg-white/[0.08]" />

          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => setColor(c)}
              className={cn(
                "h-5 w-5 rounded-full ring-1 ring-white/[0.15] transition-all",
                color === c && "ring-2 ring-white scale-110",
              )}
              style={{ backgroundColor: c }}
            />
          ))}

          <div className="mx-1 h-6 w-px bg-white/[0.08]" />

          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-16 h-1 accent-white/50"
            title="Brush size"
          />

          <div className="mx-1 h-6 w-px bg-white/[0.08]" />

          <button
            type="button"
            title="Undo"
            onClick={handleUndo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Clear all"
            onClick={onClear}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Text input overlay */}
      {textInput && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-auto"
          onPointerDown={() => {
            if (textInput.value.trim()) {
              commitText(textInput.value, textInput.x, textInput.y);
            }
            setTextInput(null);
          }}
        >
          <textarea
            autoFocus
            value={textInput.value}
            onChange={(e) =>
              setTextInput({ ...textInput, value: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commitText(textInput.value, textInput.x, textInput.y);
                setTextInput(null);
              }
              if (e.key === "Escape") {
                setTextInput(null);
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bg-black/80 text-white rounded-lg border border-white/20 p-2 shadow-2xl outline-none resize-none overflow-hidden"
            style={{
              left: textInput.displayX,
              top: textInput.displayY,
              minWidth: 120,
              minHeight: 36,
              fontSize: Math.max(12, size * 2.5),
              lineHeight: 1.4,
              fontFamily: "sans-serif",
              color: color,
            }}
            rows={1}
            placeholder="Type here..."
          />
        </div>
      )}
    </div>
  );
}
