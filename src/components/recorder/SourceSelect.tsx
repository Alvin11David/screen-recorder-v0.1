import { Monitor, AppWindow, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaptureSurface } from "@/hooks/use-screen-recorder";

interface Props {
  value: CaptureSurface;
  onChange: (value: CaptureSurface) => void;
  onSelect?: (surface: CaptureSurface) => void;
  disabled?: boolean;
}

const SOURCES: { id: CaptureSurface; label: string; description: string; icon: typeof Monitor }[] = [
  { id: "monitor", label: "Entire Screen", description: "Everything on your display", icon: Monitor },
  { id: "window", label: "Specific Window", description: "A single application", icon: AppWindow },
  { id: "browser", label: "Browser Tab", description: "One browser tab", icon: Globe },
];

export function SourceSelect({ value, onChange, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {SOURCES.map(({ id, label, description, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => { onChange(id); onSelect?.(id); }}
            className={cn(
              "group relative flex flex-col gap-2.5 rounded-xl p-4 text-left transition-all duration-300",
              "bg-background/40 backdrop-blur-sm",
              "border border-border/50",
              "hover:border-primary/40 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-lg",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-border/50 disabled:hover:shadow-none",
              active && [
                "border-primary/50 bg-primary/[0.08]",
                "shadow-[0_0_0_1px_oklch(0.74_0.15_222/0.3),0_0_30px_oklch(0.74_0.15_222/0.12)]",
              ],
            )}
          >
            {active && (
              <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-primary/[0.08] to-transparent" />
            )}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                "group-hover:scale-105",
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-[0_0_20px_oklch(0.74_0.15_222/0.3)]"
                  : "bg-white/[0.06] text-primary group-hover:bg-white/[0.1]",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground/80">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
