import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, ShieldCheck, Sparkles, AlertCircle, User,
  Monitor, AppWindow, Globe, Mic, Camera, CircleDot, Square, Pause, Play,
  Clock, HardDrive, MonitorPlay, Calendar, Download, RotateCcw, Check,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useScreenRecorder, type CaptureSurface, type RecordingResult,
  QUALITY_PRESETS, type QualityPreset, type CameraSettings,
} from "@/hooks/use-screen-recorder";
import { formatTimer, formatBytes, formatResolution } from "@/lib/recording-utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ClickFX } from "@/components/recorder/ClickFX";
import { CursorFX } from "@/components/recorder/CursorFX";
import { CountdownOverlay } from "@/components/recorder/CountdownOverlay";
import { CameraOverlay } from "@/components/recorder/CameraOverlay";

const SOURCES: {
  id: CaptureSurface;
  label: string;
  icon: typeof Monitor;
  description: string;
  tip: string;
}[] = [
  {
    id: "monitor",
    label: "Entire Screen",
    icon: Monitor,
    description: "Capture everything visible — all monitors, windows, and the desktop.",
    tip: "Best for multi-app walkthroughs and full presentations.",
  },
  {
    id: "window",
    label: "Specific Window",
    icon: AppWindow,
    description: "Record a single application window. Other content stays hidden.",
    tip: "Clean recordings — ideal for software demos and tutorials.",
  },
  {
    id: "browser",
    label: "Browser Tab",
    icon: Globe,
    description: "Capture only one browser tab. Switch tabs freely while recording.",
    tip: "Most private — notifications and other apps stay out of view.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScreenCapture Pro — Record Your Screen in 4K" },
      { name: "description", content: "Capture your screen in HD, Full HD and 4K straight from the browser and save it locally." },
    ],
  }),
  component: Index,
});

function useAudioMeter(stream: MediaStream | null) {
  const [level, setLevel] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!stream) { setLevel(0); return; }
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setLevel(Math.min(avg / 128, 1));
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf.current!); ctx.close(); };
  }, [stream]);

  return level;
}

function RecordingPreview({
  stream, status, elapsed, result,
}: {
  stream: MediaStream | null;
  status: string;
  elapsed: number;
  result: RecordingResult | null;
}) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const isLive = status === "recording" || status === "paused";
  const audioLevel = useAudioMeter(isLive ? stream : null);

  useEffect(() => {
    if (liveRef.current && stream) {
      liveRef.current.srcObject = stream;
      liveRef.current.play().catch(() => {});
    }
  }, [stream]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/[0.06] shadow-2xl">
      {isLive && (
        <>
          <video ref={liveRef} muted playsInline className="h-full w-full object-contain" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-2 backdrop-blur-xl ring-1 ring-white/[0.08]">
              <span className="relative flex h-3 w-3">
                {status === "recording" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                )}
                <span className={cn(
                  "relative inline-flex h-3 w-3 rounded-full",
                  status === "recording" ? "bg-red-500" : "bg-yellow-400",
                )} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                {status === "recording" ? "REC" : "PAUSED"}
              </span>
            </div>
            <div className="rounded-full bg-black/60 px-3.5 py-2 backdrop-blur-xl ring-1 ring-white/[0.08]">
              <span className="font-mono text-sm tabular-nums text-white/90">{formatTimer(elapsed)}</span>
            </div>
          </div>
          {status === "recording" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 backdrop-blur-xl ring-1 ring-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-white/60 transition-all duration-75"
                      style={{
                        height: `${Math.max(3, audioLevel * 40 * (0.3 + 0.7 * (i / 20)))}px`,
                        opacity: Math.max(0.2, audioLevel * (0.3 + 0.7 * (i / 20))),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!isLive && result && (
        <video src={result.url} controls className="h-full w-full object-contain" />
      )}
      {!isLive && !result && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.06]">
            <Monitor className="h-8 w-8 text-white/30" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-white/50">Your preview appears here</p>
            <p className="mt-1 text-sm text-white/30">Select a source and quality, then start recording</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceCards({
  value, onChange, onSelect, disabled,
}: {
  value: CaptureSurface;
  onChange: (v: CaptureSurface) => void;
  onSelect?: (v: CaptureSurface) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {SOURCES.map(({ id, label, icon: Icon, description, tip }) => {
        const active = value === id;
        return (
          <motion.button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => { onChange(id); onSelect?.(id); }}
            whileHover={disabled ? {} : { scale: 1.015, y: -1 }}
            whileTap={disabled ? {} : { scale: 0.985 }}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-xl p-3.5 text-left transition-all duration-300 text-balance",
              "bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]",
              "hover:border-white/[0.12]",
              "disabled:cursor-not-allowed disabled:opacity-30",
              active && [
                "bg-white/[0.06] border-white/[0.15]",
                "shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.2)]",
              ],
            )}
          >
            {active && (
              <motion.div
                layoutId="source-glow"
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="flex items-center gap-2.5 w-full">
              <span className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                active
                  ? "bg-gradient-primary text-white shadow-[0_0_16px_oklch(0.74_0.15_222/0.3)]"
                  : "bg-white/[0.04] text-white/40",
              )}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <span className={cn(
                  "block font-display text-sm font-semibold transition-colors truncate",
                  active ? "text-white" : "text-white/60",
                )}>{label}</span>
                <span className="block text-[11px] text-white/30 mt-0.5 leading-tight">{description}</span>
              </div>
            </div>
            <span className="text-[10px] text-white/20 leading-tight italic">{tip}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function QualitySelector({
  value, onChange, disabled,
}: {
  value: QualityPreset;
  onChange: (v: QualityPreset) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm ring-1 ring-white/[0.06]",
          "bg-white/[0.03] backdrop-blur-sm transition-all",
          "hover:bg-white/[0.06] hover:ring-white/[0.12]",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <MonitorPlay className="h-4 w-4 text-white/40" />
        <span className="text-white/70 font-medium">{value.label}</span>
        <svg className="w-3 h-3 text-white/30 ml-1" fill="none" viewBox="0 0 12 12">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-black/80 p-1.5 ring-1 ring-white/[0.1] backdrop-blur-2xl shadow-2xl z-20"
          >
            {QUALITY_PRESETS.map((preset) => (
              <button
                key={preset.short}
                type="button"
                onClick={() => { onChange(preset); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                  value.short === preset.short
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]",
                )}
              >
                <span className={cn(
                  "flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold uppercase",
                  value.short === preset.short
                    ? "bg-gradient-primary text-white"
                    : "bg-white/[0.05] text-white/30",
                )}>
                  {preset.short.replace("p", "")}
                </span>
                <div className="flex-1">
                  <span className="block font-medium leading-tight">{preset.label}</span>
                  <span className="block text-[10px] text-white/30 mt-0.5">{preset.width}×{preset.height}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlBar({
  status, includeAudio, onIncludeAudioChange, includeCamera, onIncludeCameraChange,
  onStart, onPause, onResume, onStop, source,
  quality, onQualityChange,
}: {
  status: string;
  includeAudio: boolean;
  onIncludeAudioChange: (v: boolean) => void;
  includeCamera: boolean;
  onIncludeCameraChange: (v: boolean) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  source: CaptureSurface;
  quality: QualityPreset;
  onQualityChange: (v: QualityPreset) => void;
}) {
  const idle = status === "idle";

  return (
    <div className="flex flex-col items-center gap-4">
      {idle && (
        <div className="flex items-center gap-3 mb-1">
          <QualitySelector value={quality} onChange={onQualityChange} disabled={!idle} />
        </div>
      )}
      <div className="flex items-center gap-3">
        {idle && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="hero"
              size="xl"
              onClick={onStart}
              className="min-w-56 group relative overflow-hidden text-base"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0" />
              <CircleDot className="h-5 w-5" />
              Start Recording
            </Button>
          </motion.div>
        )}
        {status === "recording" && (
          <>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} layout>
              <Button variant="glass" size="lg" onClick={onPause} className="group">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} layout>
              <Button variant="destructive" size="lg" onClick={onStop} className="group shadow-[0_0_0_1px_oklch(0.63_0.245_27/0.3),0_0_30px_oklch(0.63_0.245_27/0.1)]">
                <Square className="h-4 w-4 fill-current" />
                Stop
              </Button>
            </motion.div>
          </>
        )}
        {status === "paused" && (
          <>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} layout>
              <Button variant="hero" size="lg" onClick={onResume} className="group">
                <Play className="h-4 w-4" />
                Resume
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} layout>
              <Button variant="destructive" size="lg" onClick={onStop} className="group">
                <Square className="h-4 w-4 fill-current" />
                Stop & Save
              </Button>
            </motion.div>
          </>
        )}
      </div>
      {idle && (
        <div className="flex items-center gap-3">
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-pointer items-center gap-3 rounded-full bg-white/[0.03] px-5 py-2.5 text-sm ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]"
          >
            <Switch checked={includeAudio} onCheckedChange={onIncludeAudioChange} />
            <span className="text-white/50 select-none">System audio</span>
            <Mic className="h-3.5 w-3.5 text-white/30" />
          </motion.label>
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-pointer items-center gap-3 rounded-full bg-white/[0.03] px-5 py-2.5 text-sm ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]"
          >
            <Switch checked={includeCamera} onCheckedChange={onIncludeCameraChange} />
            <span className="text-white/50 select-none">Webcam</span>
            <Camera className="h-3.5 w-3.5 text-white/30" />
          </motion.label>
        </div>
      )}
    </div>
  );
}

function RecordingResultPanel({ result, onReset }: { result: RecordingResult; onReset: () => void }) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done">("idle");

  const handleSave = async () => {
    setSaveState("saving");
    const suggestedName = `screencapture-pro_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.webm`;
    const picker = (window as any).showSaveFilePicker;
    if (typeof picker === "function") {
      try {
        const handle = await picker({
          suggestedName,
          types: [{ description: "WebM Video", accept: { "video/webm": [".webm"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(result.blob);
        await writable.close();
        setSaveState("done");
        return;
      } catch (err) {
        if ((err as DOMException).name === "AbortError") { setSaveState("idle"); return; }
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(result.blob);
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSaveState("done");
  };

  const stats = [
    { icon: Clock, label: "Duration", value: formatTimer(result.durationSeconds) },
    { icon: MonitorPlay, label: "Resolution", value: formatResolution(result.width, result.height) },
    { icon: HardDrive, label: "Size", value: formatBytes(result.sizeBytes) },
    { icon: Calendar, label: "Recorded", value: result.createdAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06] p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Check className="h-4 w-4 text-emerald-400" />
          </span>
          <h2 className="font-display text-lg font-semibold text-white">Recording ready</h2>
        </div>
        <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/40 ring-1 ring-white/[0.06]">
          WEBM · High quality
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 mb-5">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-white/[0.02] p-3.5 ring-1 ring-white/[0.04]">
            <div className="flex items-center gap-1.5 text-white/30 mb-1">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-display text-sm font-semibold text-white/80">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button
          variant="hero"
          size="lg"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="group"
        >
          {saveState === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {saveState === "done" ? "Saved" : saveState === "saving" ? "Saving\u2026" : "Save Recording"}
        </Button>
        <Button variant="glass" size="lg" onClick={onReset} className="group">
          <RotateCcw className="h-4 w-4" />
          New Recording
        </Button>
      </div>
    </motion.div>
  );
}

function Index() {
  const [source, setSource] = useState<CaptureSurface>("monitor");
  const { isAuthenticated, user, logout } = useAuth();
  const {
    status, elapsed, countdown, stream, result, error,
    includeAudio, setIncludeAudio,
    includeCamera, setIncludeCamera,
    cameraStream, cameraPosition, setCameraPosition,
    cameraSettings, setCameraSettings,
    quality, setQuality,
    startRecording, cancelCountdown,
    pauseRecording, resumeRecording, stopRecording, reset,
  } = useScreenRecorder();

  const isIdle = status === "idle";
  const showClickFX = status === "recording";
  const showCursorFX = status === "recording";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.74_0.15_222/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,oklch(0.72_0.16_200/0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,oklch(0.74_0.15_222/0.08),transparent)]" />
        <div className="absolute inset-0 bg-[image:radial-gradient(oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <ClickFX active={showClickFX} />
      <CursorFX active={showCursorFX} />
      <CountdownOverlay countdown={countdown} onCancel={cancelCountdown} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl px-4 py-6 md:py-10"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-[0_0_20px_-4px_oklch(0.74_0.15_222/0.3)]">
              <Video className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-white/80">
              ScreenCapture <span className="text-gradient">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-white/[0.03] px-3 py-1 text-[11px] text-white/30 ring-1 ring-white/[0.06] flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-white/20" />
              No installs
            </span>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 ring-1 ring-white/[0.06] backdrop-blur-sm">
                  <User className="h-3 w-3" />
                  {user?.name?.split(" ")[0]}
                </span>
                <button onClick={logout} className="rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/60">
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70">
                Sign in
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="text-center mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Record your screen<br />
            <span className="text-gradient">in stunning quality</span>
          </h1>
          <p className="text-sm text-white/40 max-w-lg mx-auto">
            Capture your display in HD, Full HD or 4K directly from the browser.
            No installs, no watermarks, no data leaving your machine.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-500/10 p-3.5 text-sm ring-1 ring-red-500/20"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp} className="mb-3">
          <RecordingPreview stream={stream} status={status} elapsed={elapsed} result={result} />
        </motion.div>

        <AnimatePresence mode="wait">
          {isIdle && !result && (
            <motion.div
              key="sources"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mb-3"
            >
              <SourceCards
                value={source}
                onChange={setSource}
                disabled={!isIdle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] p-5 backdrop-blur-sm"
        >
          <ControlBar
            status={status}
            includeAudio={includeAudio}
            onIncludeAudioChange={setIncludeAudio}
            onStart={() => startRecording(source)}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
            source={source}
            quality={quality}
            onQualityChange={setQuality}
          />
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-3"
            >
              <RecordingResultPanel result={result} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mt-8 text-xs text-white/20">
          <ShieldCheck className="h-3.5 w-3.5 text-white/15" />
          Recordings never leave your device — everything is processed locally.
        </motion.div>
      </motion.div>
    </main>
  );
}
