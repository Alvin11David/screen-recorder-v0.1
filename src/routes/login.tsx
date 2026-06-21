import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, Eye, EyeOff, AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ScreenCapture Pro" },
      { name: "description", content: "Sign in to your ScreenCapture Pro account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    const err = await login(email, password);
    if (err) setError(err);
    else navigate({ to: "/" });
  };

  const handleOAuthSuccess = () => navigate({ to: "/" });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue recording."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-destructive-foreground/90 leading-snug">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className="input-base h-12"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-primary/70 hover:text-primary transition-colors">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="input-base h-12 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-4.5 w-4.5 rounded-[4px] border border-border/60 bg-white/[0.04] transition-all duration-200 peer-checked:bg-gradient-primary peer-checked:border-primary/60 group-hover:border-border/90" />
            <svg
              viewBox="0 0 12 12"
              className="absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              <path d="M2.5 6L5 8.5L9.5 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors select-none">
            Remember me
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <SocialLoginButtons onSuccess={handleOAuthSuccess} />
      </form>
    </AuthLayout>
  );
}
