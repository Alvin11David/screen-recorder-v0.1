import { Play, Pause, Square, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { RecorderStatus } from "@/hooks/use-screen-recorder";

interface Props {
  status: RecorderStatus;
  includeAudio: boolean;
  onIncludeAudioChange: (value: boolean) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function ControlPanel({
  status,
  includeAudio,
  onIncludeAudioChange,
  onStart,
  onPause,
  onResume,
  onStop,
}: Props) {
  const idle = status === "idle";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {idle && (
          <Button
            variant="hero"
            size="xl"
            onClick={onStart}
            className="min-w-48 group relative overflow-hidden"
          >
            <span className="absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
            <CircleDot className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {status === "recording" && (
          <Button
            variant="glass"
            size="xl"
            onClick={onPause}
            className="group relative overflow-hidden"
          >
            <span className="absolute inset-0 -z-10 translate-y-full bg-white/5 transition-transform duration-300 group-hover:translate-y-0" />
            <Pause className="h-5 w-5" />
            Pause
          </Button>
        )}

        {status === "paused" && (
          <Button
            variant="hero"
            size="xl"
            onClick={onResume}
            className="group relative overflow-hidden"
          >
            <span className="absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
            <Play className="h-5 w-5" />
            Resume
          </Button>
        )}

        {!idle && (
          <Button
            variant="destructive"
            size="xl"
            onClick={onStop}
            className="group relative overflow-hidden shadow-[0_0_0_1px_oklch(0.63_0.245_27/0.3),0_0_30px_oklch(0.63_0.245_27/0.1)]"
          >
            <span className="absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
            <Square className="h-5 w-5 fill-current" />
            Stop &amp; Save
          </Button>
        )}
      </div>

      {idle && (
        <label className="mx-auto flex cursor-pointer items-center gap-3 rounded-full bg-white/[0.04] px-5 py-2.5 text-sm ring-1 ring-border/50 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:ring-border/80">
          <Switch checked={includeAudio} onCheckedChange={onIncludeAudioChange} />
          <span className="text-muted-foreground select-none">Capture system / tab audio</span>
        </label>
      )}
    </div>
  );
}
