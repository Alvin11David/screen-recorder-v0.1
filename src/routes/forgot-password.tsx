import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, AlertCircle, Loader2, ArrowLeft, Check } from "lucide-react";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ScreenCapture Pro" },
      { name: "description", content: "Reset your ScreenCapture Pro password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { sendResetLink, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Email is required."); return; }
    const err = await sendResetLink(email);
    if (err) setError(err);
    else setSent(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <LiquidMetal
        {...liquidMetalPresets[2]}
        style={{ position: "fixed", inset: 0, zIndex: -10 }}
      />

      <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 py-12">
        <Link to="/" className="flex items-center gap-2.5 hero-fade-in-down group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
            <Mail className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
            ScreenCapture <span className="text-gradient">Pro</span>
          </span>
        </Link>

        <div className="glass-strong card-border-glow w-full rounded-2xl p-7 md:p-9 hero-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-primary" />
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {sent ? "Check your inbox" : "Reset your password"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/80">
              {sent
                ? "We sent a reset link to the email you provided."
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center animate-in fade-in duration-300">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary/20 ring-1 ring-primary/30 shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/40%)]">
                <Check className="h-7 w-7 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs">
                If an account exists with <span className="font-medium text-foreground">{email}</span>, you&apos;ll receive a reset link shortly.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-xs text-primary/70 hover:text-primary transition-colors"
              >
                Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-destructive-foreground/90 leading-snug">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    className="input-base h-12"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-muted-foreground/50 hero-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
