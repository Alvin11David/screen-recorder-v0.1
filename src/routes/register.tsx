import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Eye, EyeOff, AlertCircle, Loader2, Mail, Lock, User } from "lucide-react";
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-destructive-foreground/90 leading-snug">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              className="input-base h-12"
            />
          </div>
        </div>

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
              placeholder="you@example.com"
              autoComplete="email"
              className="input-base h-12"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
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

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <SocialLoginButtons onSuccess={handleOAuthSuccess} />
      </form>
    </AuthLayout>
  );
}
