import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, AlertCircle, Loader2, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/AuthLayout";

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
    <AuthLayout
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? "We sent a reset link to the email you provided."
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <Check className="h-6 w-6 text-primary" />
          </span>
          <p className="text-sm text-muted-foreground">
            If an account exists with <span className="font-medium text-foreground">{email}</span>, you&apos;ll receive a reset link shortly.
          </p>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="text-xs text-primary hover:underline"
          >
            Send again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm ring-1 ring-destructive/20">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-destructive-foreground/90">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reset-email" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="h-10 rounded-xl bg-white/[0.04] px-3.5 text-sm text-foreground ring-1 ring-border/50 outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-primary/50 focus:bg-white/[0.06]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
