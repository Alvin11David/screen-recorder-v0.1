import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface CursorFXProps {
  active: boolean;
  whiteboardActive?: boolean;
  brushSize?: number;
  brushColor?: string;
  toolName?: string;
}

export function CursorFX({
  active,
  whiteboardActive,
  brushSize = 4,
  brushColor = "#ffffff",
  toolName = "Pen",
}: CursorFXProps) {
  const [pos, setPos] = useState<Point>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const target = useRef<Point>({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const trailRef = useRef<Point[]>([]);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const lerp = () => {
      setPos((prev) => {
        const next = {
          x: prev.x + (target.current.x - prev.x) * 0.15,
          y: prev.y + (target.current.y - prev.y) * 0.15,
        };
        trailRef.current = [next, ...trailRef.current.slice(0, 3)];
        return next;
      });
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active || !visible) return null;

  const isWhiteboard = whiteboardActive;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Trail dots */}
      {isWhiteboard &&
        trailRef.current.slice(1).map((t, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: t.x,
              top: t.y,
              width: Math.max(brushSize * 0.4, 2),
              height: Math.max(brushSize * 0.4, 2),
              backgroundColor: brushColor,
              opacity: 0.15 - i * 0.04,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

      {/* Main cursor */}
      {isWhiteboard ? (
        <>
          {/* Outer brush size ring */}
          <div
            className="absolute rounded-full border-2"
            style={{
              left: pos.x,
              top: pos.y,
              width: brushSize * 2 + 24,
              height: brushSize * 2 + 24,
              transform: "translate(-50%, -50%)",
              borderColor: brushColor,
              opacity: 0.3,
              boxShadow: `0 0 12px ${brushColor}22, inset 0 0 12px ${brushColor}11`,
            }}
          />
          {/* Inner brush dot */}
          <div
            className="absolute rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              width: Math.max(brushSize, 2),
              height: Math.max(brushSize, 2),
              transform: "translate(-50%, -50%)",
              backgroundColor: brushColor,
              opacity: 0.8,
              boxShadow: `0 0 6px ${brushColor}44`,
            }}
          />
          {/* Tool label */}
          <div
            className="absolute rounded-md bg-black/60 px-1.5 py-0.5 ring-1 ring-white/[0.06]"
            style={{
              left: pos.x,
              top: pos.y + brushSize + 14,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-[9px] font-medium text-white/60 whitespace-nowrap">
              {toolName}
            </span>
          </div>
        </>
      ) : (
        /* Default recording glow */
        <div
          className="absolute rounded-full bg-gradient-to-br from-white/25 to-white/10"
          style={{
            left: pos.x,
            top: pos.y,
            width: 28,
            height: 28,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 12px oklch(0.74 0.15 222 / 0.25), 0 0 40px oklch(0.74 0.15 222 / 0.12)",
            border: "1px solid oklch(1 0 0 / 0.15)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </div>
  );
}
