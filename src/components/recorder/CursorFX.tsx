import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export function CursorFX({ active }: { active: boolean }) {
  const [pos, setPos] = useState<Point>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const target = useRef<Point>({ x: -100, y: -100 });
  const rafRef = useRef(0);

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
      setPos((prev) => ({
        x: prev.x + (target.current.x - prev.x) * 0.15,
        y: prev.y + (target.current.y - prev.y) * 0.15,
      }));
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
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
    </div>
  );
}
