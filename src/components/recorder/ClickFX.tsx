import { useEffect, useRef, useCallback, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  start: number;
}

export function ClickFX({ active }: { active: boolean }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const rafRef = useRef(0);

  const handleDown = useCallback((e: MouseEvent) => {
    const id = ++idRef.current;
    setRipples((prev) => [...prev.slice(-24), { id, x: e.clientX, y: e.clientY, start: performance.now() }]);
  }, []);

  useEffect(() => {
    if (!active) return;
    window.addEventListener("mousedown", handleDown);
    return () => window.removeEventListener("mousedown", handleDown);
  }, [active, handleDown]);

  useEffect(() => {
    if (!active || ripples.length === 0) return;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, ripples.length]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {ripples.map((r) => {
        const age = performance.now() - r.start;
        const duration = 600;
        const progress = Math.min(age / duration, 1);
        if (progress >= 1) return null;

        const scale = 0.3 + progress * 1.2;
        const opacity = 1 - progress;

        return (
          <span
            key={r.id}
            className="absolute rounded-full border-2 border-white/70"
            style={{
              left: r.x - 20,
              top: r.y - 20,
              width: 40,
              height: 40,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
}
