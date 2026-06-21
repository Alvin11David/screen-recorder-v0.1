import { useEffect, useRef } from "react";
import { Monitor } from "lucide-react";
import { formatTimer } from "@/lib/recording-utils";
import type { RecorderStatus, RecordingResult } from "@/hooks/use-screen-recorder";

interface Props {
  stream: MediaStream | null;
  status: RecorderStatus;
  elapsed: number;
  result: RecordingResult | null;
}

export function RecordingPreview({ stream, status, elapsed, result }: Props) {
  const liveRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (liveRef.current && stream) {
      liveRef.current.srcObject = stream;
      liveRef.current.play().catch(() => {});
    }
  }, [stream]);

  const isLive = status === "recording" || status === "paused";

  return (
    <div className="glass-panel-strong relative aspect-video w-full overflow-hidden rounded-2xl transition-all duration-500">
      {isLive && (
        <video
          ref={liveRef}
          muted
          playsInline
          className="h-full w-full bg-black/60 object-contain"
        />
      )}

      {!isLive && result && (
        <video src={result.url} controls className="h-full w-full bg-black/60 object-contain" />
      )}

      {!isLive && !result && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
          <div className="rounded-2xl bg-secondary/50 p-6 ring-1 ring-border/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-secondary/70">
            <Monitor className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              Your screen preview appears here
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground/80 max-w-xs mx-auto">
              Pick a source and start recording in glorious HD, Full HD or 4K.
            </p>
          </div>
        </div>
      )}

      {isLive && (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-5">
          <div className="flex items-center gap-2.5 rounded-full bg-background/60 px-4 py-2 backdrop-blur-xl ring-1 ring-border/50">
            <span className="relative flex h-2.5 w-2.5">
              {status === "recording" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  status === "recording" ? "bg-destructive" : "bg-muted-foreground"
                }`}
              />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider">
              {status === "recording" ? "Recording" : "Paused"}
            </span>
          </div>
          <div className="rounded-full bg-background/60 px-4 py-2 font-mono text-sm tabular-nums backdrop-blur-xl ring-1 ring-border/50">
            {formatTimer(elapsed)}
          </div>
        </div>
      )}
    </div>
  );
}
