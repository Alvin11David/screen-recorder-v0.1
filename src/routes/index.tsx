import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Video, ShieldCheck, Sparkles, AlertCircle, LogIn, User } from "lucide-react";
import { LiquidMetalBackground } from "@/components/ui/liquid-metal-background";
import { RecordingPreview } from "@/components/recorder/RecordingPreview";
import { SourceSelect } from "@/components/recorder/SourceSelect";
import { ControlPanel } from "@/components/recorder/ControlPanel";
import { RecordingInfo } from "@/components/recorder/RecordingInfo";
import { useScreenRecorder, type CaptureSurface } from "@/hooks/use-screen-recorder";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScreenCapture Pro — Record Your Screen in 4K" },
      {
        name: "description",
        content:
          "Capture your screen in HD, Full HD and 4K straight from the browser and save it locally. Pause, resume and export in high quality WebM.",
      },
      { property: "og:title", content: "ScreenCapture Pro" },
      {
        property: "og:description",
        content: "High-quality browser screen recording with local saving.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [source, setSource] = useState<CaptureSurface>("monitor");
  const { isAuthenticated, user, logout } = useAuth();
  const {
    status,
    elapsed,
    stream,
    result,
    error,
    includeAudio,
    setIncludeAudio,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
  } = useScreenRecorder();

  const isIdle = status === "idle";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <LiquidMetalBackground className="fixed inset-0 -z-10 h-screen w-screen opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 md:py-4">
        <div className="flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs text-muted-foreground ring-1 ring-border/50 backdrop-blur-sm">
                <User className="h-3.5 w-3.5" />
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-white/[0.08] hover:text-foreground backdrop-blur-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3.5 py-1.5 text-xs text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-white/[0.08] hover:text-foreground backdrop-blur-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          )}
        </div>
        <header className="flex flex-col items-center gap-1 text-center">
          <span className="glass-deep inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Browser-native · No installs · No watermarks
          </span>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10">
              <Video className="h-5 w-5 text-primary-foreground" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              ScreenCapture <span className="text-gradient">Pro</span>
            </h1>
          </div>
          <p className="max-w-xl text-balance text-xs text-muted-foreground">
            Record your screen in the highest quality your display supports and save it directly to
            your device — all without leaving the browser.
          </p>
        </header>

        {error && (
          <div className="glass-hover flex items-start gap-3 rounded-xl p-3 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-foreground">{error}</p>
          </div>
        )}

        <section className="flex flex-col gap-2">
          <div className="max-h-[35vh] overflow-hidden rounded-2xl">
            <RecordingPreview stream={stream} status={status} elapsed={elapsed} result={result} />
          </div>

          {isIdle && !result && (
            <SourceSelect value={source} onChange={setSource} disabled={!isIdle} />
          )}

          <div className="glass-strong rounded-2xl p-4">
            <ControlPanel
              status={status}
              includeAudio={includeAudio}
              onIncludeAudioChange={setIncludeAudio}
              onStart={() => startRecording(source)}
              onPause={pauseRecording}
              onResume={resumeRecording}
              onStop={stopRecording}
            />
          </div>

          {result && <RecordingInfo result={result} onReset={reset} />}
        </section>

        <footer className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
          <ShieldCheck className="h-3.5 w-3.5 text-primary/60" />
          Recordings never leave your device — everything is processed locally.
        </footer>
      </div>
    </main>
  );
}
