import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Mail, AlertCircle, Loader2, ArrowLeft, Video, KeyRound, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AetherFlowHero from "@/components/ui/aether-flow-hero";

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
  const navigate = useNavigate();
  const { sendResetLink, verifyResetCode, resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Email is required."); return; }
    const err = await sendResetLink(email);
    if (err) setError(err);
    else setSent(true);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setCodeError(null);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    const newCode = [...code];
    for (let i = 0; i < 5; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);
    const nextIndex = Math.min(pasted.length, 4);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 5) { setCodeError("Please enter the full 5-digit code."); return; }
    setVerifying(true);
    setCodeError(null);
    // Simulate verification — in production this would call an API
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    navigate({ to: "/login" });
  };

  const handleSendAgain = () => {
    setSent(false);
    setCode(["", "", "", "", ""]);
    setCodeError(null);
    sendResetLink(email);
  };

  return (
    <AetherFlowHero>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-md px-4 py-12 min-h-screen mx-auto">
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
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {sent ? "Check your inbox" : "Reset your password"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/80">
              {sent
                ? `Enter the 5-digit code sent to ${email}`
                : "Enter your email and we'll send you a reset code."}
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-6 py-2 animate-in fade-in duration-300">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary/20 ring-1 ring-primary/30 shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/40%)]">
                <KeyRound className="h-7 w-7 text-primary" />
              </span>

              {codeError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 w-full">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-destructive-foreground/90 leading-snug">{codeError}</p>
                </div>
              )}

              <div className="flex items-center gap-3" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="h-14 w-12 rounded-xl bg-white/[0.04] text-center text-xl font-semibold text-foreground ring-1 ring-border/50 outline-none transition-all focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.06]"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]"
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  {verifying ? "Verifying..." : "Verify code"}
                </button>

                <button
                  onClick={handleSendAgain}
                  className="text-xs text-primary/70 hover:text-primary transition-colors"
                >
                  Send again
                </button>
              </div>
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
                {isLoading ? "Sending..." : "Send reset code"}
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
    </AetherFlowHero>
  );
}
