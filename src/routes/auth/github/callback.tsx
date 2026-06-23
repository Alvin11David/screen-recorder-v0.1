import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { exchangeGitHubCode } from "@/lib/github-auth";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/github/callback")({
  validateSearch: (search: Record<string, string>) => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
  }),
  component: GitHubCallbackPage,
});

function GitHubCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { register: _, ...auth } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { code, state } = search;

    if (!code) {
      setStatus("error");
      setError("No authorization code received from GitHub.");
      return;
    }

    const savedState = sessionStorage.getItem("github_oauth_state");
    sessionStorage.removeItem("github_oauth_state");

    if (state && savedState && state !== savedState) {
      setStatus("error");
      setError("State mismatch — authentication was rejected for security.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const user = await exchangeGitHubCode({ data: code });
        if (cancelled) return;
        localStorage.setItem("sc-auth-user", JSON.stringify(user));
        localStorage.setItem("sc-auth-token", user.token);
        setStatus("success");
        await new Promise((r) => setTimeout(r, 800));
        if (!cancelled) navigate({ to: "/" });
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Authentication failed.");
      }
    })();

    return () => { cancelled = true; };
  }, [search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
        {status === "loading" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Completing GitHub sign in…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm text-emerald-500 font-medium">Signed in successfully!</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => navigate({ to: "/login" })}
              className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
