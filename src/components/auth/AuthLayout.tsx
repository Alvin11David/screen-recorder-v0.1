import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { LiquidMetalBackground } from "@/components/ui/liquid-metal-background";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <LiquidMetalBackground className="min-h-screen">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-md px-4 py-12">
        <Link to="/" className="flex items-center gap-2.5 hero-fade-in-down group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
            <Video className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
            ScreenCapture <span className="text-gradient">Pro</span>
          </span>
        </Link>

        <div className="glass-strong card-border-glow w-full rounded-2xl p-7 md:p-9 hero-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-primary" />
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground/80">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="text-xs text-muted-foreground/50 hero-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {footer}
        </p>
      </div>
    </AnimatedShaderHero>
  );
}
