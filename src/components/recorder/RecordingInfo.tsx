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
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">Recording ready</h2>
        <span className="rounded-full bg-primary/[0.1] px-3 py-1 text-xs text-primary ring-1 ring-primary/20 backdrop-blur-sm">
          WebM · High quality
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-border/50 transition-all duration-200 hover:bg-white/[0.06] hover:ring-border/80"
          >
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <Icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">{label}</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="hero"
          size="lg"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="group relative overflow-hidden"
        >
          <span className="absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
          {saveState === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {saveState === "done" ? "Saved" : saveState === "saving" ? "Saving\u2026" : "Save Recording"}
        </Button>
        <Button variant="glass" size="lg" onClick={onReset} className="group relative overflow-hidden">
          <span className="absolute inset-0 -z-10 translate-y-full bg-white/5 transition-transform duration-300 group-hover:translate-y-0" />
          <RotateCcw className="h-4 w-4" />
          New Recording
        </Button>
      </div>
    </div>
  );
}
