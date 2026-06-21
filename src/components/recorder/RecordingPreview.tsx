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
    <div className="glass-panel relative aspect-video w-full overflow-hidden rounded-2xl">
      {isLive && (
        <video
          ref={liveRef}
          muted
          playsInline
          className="h-full w-full object-contain bg-black/40"
        />
      )}

      {!isLive && result && (
        <video src={result.url} controls className="h-full w-full bg-black/40 object-contain" />
      )}

      {!isLive && !result && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-2xl bg-secondary/60 p-5 ring-1 ring-border">
            <Monitor className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              Your screen preview appears here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a source and start recording in glorious HD, Full HD or 4K.
            </p>
          </div>
        </div>
      )}

      {isLive && (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-4">
          <div className="flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 backdrop-blur-md ring-1 ring-border">
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
            <span className="text-xs font-medium uppercase tracking-wide">
              {status === "recording" ? "Recording" : "Paused"}
            </span>
          </div>
          <div className="rounded-full bg-background/70 px-3 py-1.5 font-mono text-sm tabular-nums backdrop-blur-md ring-1 ring-border">
            {formatTimer(elapsed)}
          </div>
        </div>
      )}
    </div>
  );
}
