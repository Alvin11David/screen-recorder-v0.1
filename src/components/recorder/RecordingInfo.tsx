import { useState } from "react";
import { Clock, MonitorPlay, HardDrive, Calendar, Download, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, formatResolution, formatTimer, saveRecording } from "@/lib/recording-utils";
import type { RecordingResult } from "@/hooks/use-screen-recorder";

interface Props {
  result: RecordingResult;
  onReset: () => void;
}

export function RecordingInfo({ result, onReset }: Props) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done">("idle");

  const handleSave = async () => {
    setSaveState("saving");
    const outcome = await saveRecording(result.blob, result.createdAt);
    setSaveState(outcome === "cancelled" ? "idle" : "done");
  };

  const stats = [
    { icon: Clock, label: "Duration", value: formatTimer(result.durationSeconds) },
    { icon: MonitorPlay, label: "Resolution", value: formatResolution(result.width, result.height) },
    { icon: HardDrive, label: "File size", value: formatBytes(result.sizeBytes) },
    {
      icon: Calendar,
      label: "Recorded",
      value: result.createdAt.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">Recording ready</h2>
        <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
          WebM · High quality
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-secondary/40 p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">{label}</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="hero" size="lg" onClick={handleSave} disabled={saveState === "saving"}>
          {saveState === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {saveState === "done" ? "Saved" : saveState === "saving" ? "Saving…" : "Save Recording"}
        </Button>
        <Button variant="glass" size="lg" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          New Recording
        </Button>
      </div>
    </div>
  );
}
