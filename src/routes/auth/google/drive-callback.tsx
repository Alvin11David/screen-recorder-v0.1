import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { connectDrive } from "@/lib/drive";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/google/drive-callback")({
  validateSearch: (search: Record<string, string>) => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
  }),
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: GoogleDriveCallbackPage,
});

function GoogleDriveCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { code, state } = search;
    console.info(`[drive-callback] search: code=${code ? "present" : "MISSING"} state=${state ? "present" : "MISSING"} isAuthenticated=${isAuthenticated}`);

    if (!code) {
      setStatus("error");
      setError("No authorization code received from Google.");
      return;
    }

    const savedState = sessionStorage.getItem("google_drive_oauth_state");
    sessionStorage.removeItem("google_drive_oauth_state");

    if (state && savedState && state !== savedState) {
      setStatus("error");
      setError("State mismatch — connection was rejected for security.");
      return;
    }

    if (!isAuthenticated) {
      setStatus("error");
      setError("You must be signed in before connecting Google Drive.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/google/drive-callback`;
        const connection = await connectDrive(code, redirectUri);
        if (cancelled) return;
        sessionStorage.setItem("sc-drive-token", connection.accessToken);
        sessionStorage.setItem("sc-drive-email", connection.driveEmail);
        setStatus("success");
        await new Promise((r) => setTimeout(r, 800));
        if (!cancelled) navigate({ to: "/" });
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to connect Google Drive.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [search, navigate, isAuthenticated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
        {status === "loading" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Connecting Google Drive…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm text-emerald-500 font-medium">Google Drive connected!</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Back to recorder
            </button>
          </>
        )}
      </div>
    </div>
  );
}
