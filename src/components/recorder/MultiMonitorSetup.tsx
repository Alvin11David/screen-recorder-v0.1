import { useRef, useEffect } from "react";
import { Monitor, Plus, Video, X } from "lucide-react";

interface MultiMonitorSetupProps {
  streams: MediaStream[];
  onAddMonitor: () => void;
  onStart: () => void;
  onCancel: () => void;
}

export function MultiMonitorSetup({
  streams,
  onAddMonitor,
  onStart,
  onCancel,
}: MultiMonitorSetupProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm select-none">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm font-medium text-white/70">
            Multi-monitor setup — {streams.length} display{streams.length !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 gap-6">
          {streams.map((stream, i) => (
            <MonitorPreview key={i} stream={stream} label={`Display ${i + 1}`} />
          ))}
          <button
            type="button"
            onClick={onAddMonitor}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] px-10 py-12 transition-all hover:border-white/[0.3] hover:bg-white/[0.04]"
          >
            <Plus className="h-8 w-8 text-white/30" />
            <span className="text-sm text-white/40">Add another display</span>
          </button>
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
            onClick={onStart}
            disabled={streams.length < 2}
            className="flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.4)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Video className="h-4 w-4" />
            Record All ({streams.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function MonitorPreview({ stream, label }: { stream: MediaStream; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const track = stream.getVideoTracks()[0];
  const settings = track?.getSettings();
  const label_text = track?.label ?? label;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-video w-64 overflow-hidden rounded-xl bg-black/60 ring-1 ring-white/[0.08]">
        <video ref={videoRef} muted playsInline className="h-full w-full object-contain" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 ring-1 ring-white/[0.08]">
          <Monitor className="h-3 w-3 text-white/50" />
          <span className="text-[10px] text-white/60 truncate max-w-32">{label_text}</span>
        </div>
      </div>
      {settings && (
        <span className="text-[11px] text-white/30 font-mono">
          {settings.width}×{settings.height}
        </span>
      )}
    </div>
  );
}
