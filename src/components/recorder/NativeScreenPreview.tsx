import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { subscribeNativePreview } from "@/lib/native-recorder";

interface Props {
  paused?: boolean;
}

/**
 * Renders a live preview of the screen while the native Android service is
 * recording. Frames arrive from the native service as data-URL JPEGs over the
 * Capacitor bridge and are drawn straight onto the <img> element (no React
 * state, so the rest of the page doesn't re-render).
 */
export function NativeScreenPreview({ paused }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    let active = true;
    let handle: { remove: () => void } | null = null;

    subscribeNativePreview(
      (dataUrl) => {
        if (!active) return;
        const img = imgRef.current;
        if (img && !pausedRef.current) img.src = dataUrl;
      },
      () => {
        if (imgRef.current) imgRef.current.src = "";
      },
    ).then((h) => {
      if (active) handle = h;
      else h.remove();
    });

    return () => {
      active = false;
      handle?.remove();
    };
  }, []);

  return (
    <img
      ref={imgRef}
      alt=""
      className={cn(
        "h-full w-full object-contain transition-all duration-500",
        paused && "brightness-75",
      )}
    />
  );
}
