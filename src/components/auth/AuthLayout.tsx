import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <AnimatedShaderHero className="min-h-screen">
      <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
        <Link to="/" className="flex items-center gap-2.5 hero-fade-in-down">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10">
            <Video className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            ScreenCapture <span className="text-gradient">Pro</span>
          </span>
        </Link>

        <div className="glass-strong w-full rounded-2xl p-6 md:p-8 hero-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="mb-6 text-center">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="text-xs text-muted-foreground/60 hero-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {footer}
        </p>
      </div>
    </AnimatedShaderHero>
  );
}
