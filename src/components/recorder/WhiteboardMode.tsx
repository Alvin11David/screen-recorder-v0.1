import { useEffect, useRef, useState, useCallback } from "react";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = "pen" | "highlighter" | "eraser" | "line" | "arrow" | "rect" | "circle" | "text";

interface Point {
  x: number;
  y: number;
}

const COLORS = [
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

const BRUSH_SIZES = [2, 4, 6, 8, 12, 16, 24];

const TOOLS: { id: Tool; icon: typeof Pencil; label: string }[] = [
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "arrow", icon: ArrowUpRight, label: "Arrow" },
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "text", icon: Type, label: "Text" },
];

function CursorPreview({
  pos,
  visible,
  color,
  size,
  tool,
}: {
  pos: Point;
  visible: boolean;
  color: string;
  size: number;
  tool: Tool;
}) {
  if (!visible) return null;

  const toolLabel = TOOLS.find((t) => t.id === tool)?.label ?? "";

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      >
        <div
          className="rounded-full border-2 transition-all duration-75"
          style={{
            width: size * 2 + 20,
            height: size * 2 + 20,
            borderColor: color,
            opacity: 0.35,
            marginLeft: -(size + 10),
            marginTop: -(size + 10),
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width: Math.max(size, 2),
            height: Math.max(size, 2),
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
        <div
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-black/70 px-1.5 py-0.5 ring-1 ring-white/[0.08]"
        >
          <span className="text-[10px] font-medium text-white/70 whitespace-nowrap">{toolLabel}</span>
        </div>
      </div>
    </div>
  );
}

interface WhiteboardModeProps {
  active: boolean;
  onClose: () => void;
}

export function WhiteboardMode({ active, onClose }: WhiteboardModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const undoStack = useRef<ImageData[]>([]);
  const startPos = useRef<Point>({ x: 0, y: 0 });
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(4);
  const [cursorPos, setCursorPos] = useState<Point>({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const targetCursor = useRef<Point>({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const toolRef = useRef(tool);
  toolRef.current = tool;
  const colorRef = useRef(color);
  colorRef.current = color;
  const sizeRef = useRef(brushSize);
  sizeRef.current = brushSize;

  // ── Canvas setup ──
  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  // ── Cursor tracking ──
  useEffect(() => {
    if (!active) {
      setCursorVisible(false);
      return;
    }

    const onMove = (e: MouseEvent) => {
      targetCursor.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);
    const onEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [active]);

  // ── Smooth cursor ──
  useEffect(() => {
    if (!active) return;

    const lerp = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetCursor.current.x - prev.x) * 0.15,
        y: prev.y + (targetCursor.current.y - prev.y) * 0.15,
      }));
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  // ── Undo helpers ──
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.current.push(data);
    if (undoStack.current.length > 30) undoStack.current.shift();
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const prev = undoStack.current.pop();
    if (!prev) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.putImageData(prev, 0, 0);
  }, []);

  // ── Drawing helpers ──
  const getCtxProps = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = toolRef.current;
    if (t === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = sizeRef.current * 10;
      ctx.fillStyle = "rgba(0,0,0,1)";
    } else if (t === "highlighter") {
      ctx.strokeStyle = colorRef.current;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = sizeRef.current * 4;
      ctx.fillStyle = colorRef.current;
    } else {
      ctx.strokeStyle = colorRef.current;
      ctx.globalAlpha = 1;
      ctx.lineWidth = sizeRef.current;
      ctx.fillStyle = colorRef.current;
    }
  }, []);

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const t = toolRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (t === "text") {
      setTextInput({ x, y, value: "" });
      return;
    }

    drawing.current = true;
    startPos.current = { x, y };
    lastPos.current = { x, y };

    if (t === "pen" || t === "highlighter" || t === "eraser") {
      saveSnapshot();
      getCtxProps(ctx);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [saveSnapshot, getCtxProps]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const t = toolRef.current;

    if (t === "pen" || t === "highlighter" || t === "eraser") {
      getCtxProps(ctx);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      ctx.restore();
      ctx.save();
      getCtxProps(ctx);
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const x1 = startPos.current.x;
      const y1 = startPos.current.y;
      const sx = sizeRef.current;
      const c = colorRef.current;

      // Clear and redraw base
      const dpr2 = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.restore();

      // Redraw everything from undo snapshot + shape preview
      // We use a simpler approach: clear, redraw from saved state, draw shape
      const prev = undoStack.current[undoStack.current.length - 1];
      if (prev) {
        ctx.putImageData(prev, 0, 0);
      }

      ctx.save();
      getCtxProps(ctx);
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (t) {
        case "line":
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
        case "arrow": {
          const angle = Math.atan2(y - y1, x - x1);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(x, y);
          ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;
        }
        case "rect":
          ctx.strokeRect(Math.min(x1, x), Math.min(y1, y), Math.abs(x - x1), Math.abs(y - y1));
          break;
        case "circle": {
          const cx = (x1 + x) / 2;
          const cy = (y1 + y) / 2;
          const rx = Math.abs(x - x1) / 2;
          const ry = Math.abs(y - y1) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
      }
      ctx.restore();
    }

    lastPos.current = { x, y };
  }, [getCtxProps]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const t = toolRef.current;
    if (t === "pen" || t === "highlighter" || t === "eraser") return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const x1 = startPos.current.x;
    const y1 = startPos.current.y;

    saveSnapshot();

    // Redraw base
    const prev = undoStack.current[undoStack.current.length - 2];
    if (prev) {
      ctx.putImageData(prev, 0, 0);
    }

    ctx.save();
    getCtxProps(ctx);
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (t) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case "arrow": {
        const angle = Math.atan2(y - y1, x - x1);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case "rect":
        ctx.strokeRect(Math.min(x1, x), Math.min(y1, y), Math.abs(x - x1), Math.abs(y - y1));
        break;
      case "circle": {
        const cx = (x1 + x) / 2;
        const cy = (y1 + y) / 2;
        const rx = Math.abs(x - x1) / 2;
        const ry = Math.abs(y - y1) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }, [saveSnapshot, getCtxProps]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [saveSnapshot]);

  // ── Commit text ──
  const commitText = useCallback((text: string, x: number, y: number) => {
    if (!text.trim()) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    saveSnapshot();
    ctx.save();
    ctx.font = `${sizeRef.current * 5}px sans-serif`;
    ctx.fillStyle = colorRef.current;
    ctx.globalAlpha = 1;
    ctx.textBaseline = "top";
    const lines = text.split("\n");
    const lineH = sizeRef.current * 6;
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineH);
    });
    ctx.restore();
  }, [saveSnapshot]);

  if (!active) return null;

  return (
    <>
      {/* Cursor preview */}
      <CursorPreview
        pos={cursorPos}
        visible={cursorVisible}
        color={color}
        size={brushSize}
        tool={tool}
      />

      {/* Canvas */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9995]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none", cursor: "none" }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* ── Toolbar ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9996] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center gap-2 rounded-2xl bg-black/80 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl pointer-events-auto"
        >
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => setTool(id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                tool === id
                  ? "bg-white/[0.12] text-white shadow-sm"
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
                "h-5 w-5 rounded-full ring-1 ring-white/[0.15] transition-all shrink-0",
                color === c && "ring-2 ring-white scale-110",
              )}
              style={{ backgroundColor: c }}
            />
          ))}

          <div className="mx-1 h-6 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                title={`${s}px`}
                onClick={() => setBrushSize(s)}
                className={cn(
                  "flex items-center justify-center rounded-lg transition-all",
                  brushSize === s
                    ? "bg-white/[0.1]"
                    : "hover:bg-white/[0.04]",
                )}
                style={{ width: 20, height: 20 }}
              >
                <div
                  className="rounded-full bg-white/60"
                  style={{
                    width: Math.max(2, (s / 24) * 12),
                    height: Math.max(2, (s / 24) * 12),
                  }}
                />
              </button>
            ))}
          </div>

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
            onClick={handleClear}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-white/[0.08]" />

          <button
            type="button"
            title="Close whiteboard"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* ── Text input overlay ── */}
      {textInput && (
        <div
          className="fixed inset-0 z-[9997]"
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
            onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
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
              left: textInput.x,
              top: textInput.y,
              minWidth: 120,
              minHeight: 36,
              fontSize: Math.max(12, brushSize * 2.5),
              lineHeight: 1.4,
              fontFamily: "sans-serif",
              color: color,
            }}
            rows={1}
            placeholder="Type here..."
          />
        </div>
      )}
    </>
  );
}
