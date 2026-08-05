import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { MonitorPlay, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SeoFooter } from "./SeoFooter";

export interface SeoFeature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface SeoStep {
  title: string;
  text: string;
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoRelated {
  name: string;
  path: string;
  description: string;
}

interface SeoLandingLayoutProps {
  badge: string;
  h1: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo?: string;
  features?: SeoFeature[];
  steps?: SeoStep[];
  faqs?: SeoFaq[];
  related?: SeoRelated[];
  children?: ReactNode;
  className?: string;
}

export function SeoLandingLayout({
  badge,
  h1,
  subtitle,
  ctaLabel,
  ctaTo = "/",
  features = [],
  steps = [],
  faqs = [],
  related = [],
  children,
  className,
}: SeoLandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoNav />
      <main className={cn("flex-1", className)}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70">
              <MonitorPlay className="h-3.5 w-3.5 text-primary" />
              {badge}
            </span>
            <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              {h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={ctaTo}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/screen-recorder"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08]"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>

        {children}

        {/* Features */}
        {features.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everything you need to record great video
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="glass-card rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How it works */}
        {steps.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              How it works
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="glass-card group rounded-2xl px-6 py-5 open:pb-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Keep exploring
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.path}
                  to={r.path}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-primary/30 hover:bg-white/[0.04]"
                >
                  <h3 className="font-display text-base font-semibold text-white group-hover:text-primary transition-colors">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="glass-card relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-primary/10" />
            <h2 className="relative font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Start recording in seconds
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Open ScreenFlow, hit record, and capture your screen in up to 4K. Free forever — no account
              needed, everything stays on your device.
            </p>
            <Link
              to={ctaTo}
              className="relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          </div>
        </section>
      </main>
      <SeoFooter />
    </div>
  );
}

function SeoNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5z" />
              <circle cx="12" cy="12" r="2" fill="oklch(0.15 0.025 264)" />
            </svg>
          </span>
          <span className="font-display text-base font-bold tracking-tight text-white">ScreenFlow</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white">
            Home
          </Link>
          <Link to="/screen-recorder" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white">
            Recorder
          </Link>
          <Link to="/guides/how-to-record-your-screen" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white">
            Guides
          </Link>
        </nav>
        <Link
          to="/"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          Record now
        </Link>
      </div>
    </header>
  );
}
