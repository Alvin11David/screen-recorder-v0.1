import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Video, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-lines";
import { RecordingPreview } from "@/components/recorder/RecordingPreview";
import { SourceSelect } from "@/components/recorder/SourceSelect";
import { ControlPanel } from "@/components/recorder/ControlPanel";
import { RecordingInfo } from "@/components/recorder/RecordingInfo";
import { useScreenRecorder, type CaptureSurface } from "@/hooks/use-screen-recorder";

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
      <ShaderAnimation className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-background/40" />

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:py-14">
        <header className="flex flex-col items-center gap-5 text-center">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Browser-native · No installs · No watermarks
          </span>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-[var(--shadow-glow)]">
              <Video className="h-6 w-6 text-primary-foreground" />
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              ScreenCapture <span className="text-gradient">Pro</span>
            </h1>
          </div>
          <p className="max-w-xl text-balance text-muted-foreground">
            Record your screen in the highest quality your display supports and save it directly to
            your device — all without leaving the browser.
          </p>
        </header>

        {error && (
          <div className="glass-panel flex items-start gap-3 rounded-xl border-destructive/40 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-foreground">{error}</p>
          </div>
        )}

        <section className="flex flex-col gap-6">
          <RecordingPreview stream={stream} status={status} elapsed={elapsed} result={result} />

          {isIdle && !result && (
            <SourceSelect value={source} onChange={setSource} disabled={!isIdle} />
          )}

          <div className="glass-panel rounded-2xl p-6">
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

        <footer className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Recordings never leave your device — everything is processed locally.
        </footer>
      </div>
    </main>
  );
}
