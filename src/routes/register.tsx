import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — ScreenCapture Pro" },
      { name: "description", content: "Create your ScreenCapture Pro account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const err = await register(name, email, password);
    if (err) setError(err);
    else navigate({ to: "/" });
  };

  const handleOAuthSuccess = () => navigate({ to: "/" });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start recording in seconds — no credit card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm ring-1 ring-destructive/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-destructive-foreground/90">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="h-10 rounded-xl bg-white/[0.04] px-3.5 text-sm text-foreground ring-1 ring-border/50 outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-primary/50 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-10 rounded-xl bg-white/[0.04] px-3.5 text-sm text-foreground ring-1 ring-border/50 outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-primary/50 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className="h-10 w-full rounded-xl bg-white/[0.04] px-3.5 pr-10 text-sm text-foreground ring-1 ring-border/50 outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-primary/50 focus:bg-white/[0.06]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <SocialLoginButtons onSuccess={handleOAuthSuccess} />
      </form>
    </AuthLayout>
  );
}
