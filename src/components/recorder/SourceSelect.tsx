import { Monitor, AppWindow, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaptureSurface } from "@/hooks/use-screen-recorder";

interface Props {
  value: CaptureSurface;
  onChange: (value: CaptureSurface) => void;
  disabled?: boolean;
}

const SOURCES: { id: CaptureSurface; label: string; description: string; icon: typeof Monitor }[] = [
  { id: "monitor", label: "Entire Screen", description: "Everything on your display", icon: Monitor },
  { id: "window", label: "Specific Window", description: "A single application", icon: AppWindow },
  { id: "browser", label: "Browser Tab", description: "One browser tab", icon: Globe },
];

export function SourceSelect({ value, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {SOURCES.map(({ id, label, description, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            className={cn(
              "glass-panel group flex flex-col gap-2 rounded-xl p-4 text-left transition-all",
              "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
              active && "ring-2 ring-primary",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                active ? "bg-gradient-primary text-primary-foreground" : "bg-secondary/60 text-primary",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
