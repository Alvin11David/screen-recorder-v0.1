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
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {idle && (
          <Button variant="hero" size="xl" onClick={onStart} className="min-w-48">
            <CircleDot className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {status === "recording" && (
          <Button variant="glass" size="xl" onClick={onPause}>
            <Pause className="h-5 w-5" />
            Pause
          </Button>
        )}

        {status === "paused" && (
          <Button variant="hero" size="xl" onClick={onResume}>
            <Play className="h-5 w-5" />
            Resume
          </Button>
        )}

        {!idle && (
          <Button variant="destructive" size="xl" onClick={onStop}>
            <Square className="h-5 w-5 fill-current" />
            Stop &amp; Save
          </Button>
        )}
      </div>

      {idle && (
        <label className="mx-auto flex items-center gap-3 rounded-full bg-secondary/50 px-4 py-2 text-sm ring-1 ring-border">
          <Switch checked={includeAudio} onCheckedChange={onIncludeAudioChange} />
          <span className="text-muted-foreground">Capture system / tab audio</span>
        </label>
      )}
    </div>
  );
}
