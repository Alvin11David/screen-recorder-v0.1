import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-lines";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <ShaderAnimation className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen opacity-30" />

      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10">
            <Video className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            ScreenCapture <span className="text-gradient">Pro</span>
          </span>
        </Link>

        <div className="glass-strong w-full rounded-2xl p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="text-xs text-muted-foreground/60">{footer}</p>
      </div>
    </main>
  );
}
