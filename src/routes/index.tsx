import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  User,
  Monitor,
  MonitorUp,
  AppWindow,
  Globe,
  Pencil,
  Mic,
  Camera,
  CircleDot,
  Square,
  Pause,
  Play,
  Clock,
  HardDrive,
  MonitorPlay,
  Calendar,
  Download,
  RotateCcw,
  Check,
  Zap,
  Lock,
  Hash,
  Expand,
  Film,
  History,
  Keyboard,
  Timer,
  Volume2,
  VolumeX,
  AlignLeft,
  Settings,
  ChevronDown,
  ChevronUp,
  Gauge,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useScreenRecorder,
  type CaptureSurface,
  type RecordingResult,
  QUALITY_PRESETS,
  type QualityPreset,
  type CameraSettings,
} from "@/hooks/use-screen-recorder";
import { formatTimer, formatBytes, formatResolution } from "@/lib/recording-utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ClickFX } from "@/components/recorder/ClickFX";
import { CursorFX } from "@/components/recorder/CursorFX";
import { WhiteboardMode } from "@/components/recorder/WhiteboardMode";
import { CountdownOverlay } from "@/components/recorder/CountdownOverlay";
import { CameraOverlay } from "@/components/recorder/CameraOverlay";
import { CropOverlay } from "@/components/recorder/CropOverlay";
import { MultiMonitorSetup } from "@/components/recorder/MultiMonitorSetup";
import { DrawingOverlay } from "@/components/recorder/DrawingOverlay";
import { VideoEditor } from "@/components/editor/VideoEditor";
import { SpotlightOverlay } from "@/components/recorder/SpotlightOverlay";
import { FloatingMiniBar } from "@/components/recorder/FloatingMiniBar";
import { RecordingHistory, saveToHistory } from "@/components/recorder/RecordingHistory";
import { KeyboardShortcutsPanel } from "@/components/recorder/KeyboardShortcutsPanel";
import { TeleprompterOverlay } from "@/components/recorder/TeleprompterOverlay";

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
  {
    id: "multi-monitor",
    label: "All Displays",
    icon: MonitorUp,
    description: "Capture multiple monitors side by side in a single recording.",
    tip: "Great for multi-screen setups and presentations.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScreenFlow — Record Your Screen in 4K" },
      {
        name: "description",
        content:
          "Capture your screen in HD, Full HD and 4K straight from the browser and save it locally.",
      },
    ],
  }),
  component: Index,
});

function useAudioMeter(stream: MediaStream | null) {
  const [level, setLevel] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }
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
    return () => {
      cancelAnimationFrame(raf.current!);
      ctx.close();
    };
  }, [stream]);

  return level;
}

const FEATURES = [
  { icon: Zap, label: "HD / Full HD / 4K" },
  { icon: Lock, label: "100% local" },
  { icon: ShieldCheck, label: "No watermark" },
  { icon: Hash, label: "No data leaves" },
] as const;

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  left: `${((i * 3.7 + 1.2) % 100).toFixed(1)}%`,
  top: `${((i * 7.3 + 5.1) % 100).toFixed(1)}%`,
  delay: `${((i * 0.7) % 5).toFixed(1)}s`,
  size: 1 + (i % 3) * 0.5,
  duration: `${(3 + (i % 5) * 0.5).toFixed(1)}s`,
}));

function RecordingPreview({
  stream,
  status,
  elapsed,
  result,
}: {
  stream: MediaStream | null;
  status: string;
  elapsed: number;
  result: RecordingResult | null;
}) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const isLive = status === "recording" || status === "paused";
  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const [livePlayFailed, setLivePlayFailed] = useState(false);
  const audioLevel = useAudioMeter(isLive ? stream : null);

  useEffect(() => {
    if (liveRef.current && stream) {
      liveRef.current.srcObject = stream;
      setLivePlayFailed(false);
      liveRef.current.play().catch(() => setLivePlayFailed(true));
    }
  }, [stream]);

  const retryPlay = useCallback(() => {
    if (liveRef.current) {
      setLivePlayFailed(false);
      liveRef.current.play().catch(() => setLivePlayFailed(true));
    }
  }, []);

  return (
    <div className="relative group">
      {/* ── Reactive ambient halo ── */}
      <div
        className={cn(
          "absolute -inset-6 -z-10 rounded-3xl blur-[70px] transition-all duration-1000",
          isRecording
            ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.63_0.245_27/0.18)_0%,oklch(0.74_0.15_222/0.10)_50%,transparent_80%)]"
            : isPaused
            ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.18_80/0.14)_0%,oklch(0.74_0.15_222/0.08)_50%,transparent_80%)]"
            : result
            ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_160/0.14)_0%,oklch(0.74_0.15_222/0.08)_50%,transparent_80%)]"
            : "opacity-50 bg-[radial-gradient(ellipse_at_top,oklch(0.74_0.15_222/0.12)_0%,transparent_70%)]",
        )}
      />

      {/* ── Monitor outer frame ── */}
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl transition-all duration-700",
          "bg-[oklch(0.09_0.02_264)]",
          isRecording
            ? "shadow-[0_0_0_1.5px_oklch(0.63_0.245_27/0.55),0_0_0_4px_oklch(0.63_0.245_27/0.10),0_40px_100px_-24px_oklch(0_0_0/0.85)]"
            : isPaused
            ? "shadow-[0_0_0_1.5px_oklch(0.85_0.18_80/0.45),0_0_0_4px_oklch(0.85_0.18_80/0.08),0_40px_100px_-24px_oklch(0_0_0/0.85)]"
            : "shadow-[0_0_0_1px_oklch(1_0_0/0.08),0_40px_100px_-24px_oklch(0_0_0/0.80)]",
        )}
      >
        {/* ── Recording rim pulse ── */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              key="rec-rim"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 z-30 rounded-2xl pointer-events-none ring-2 ring-inset ring-red-500/30"
            />
          )}
        </AnimatePresence>

        {/* ── Chrome title bar ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-9 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-[6px]">
              <div className="h-[11px] w-[11px] rounded-full bg-[oklch(0.7_0.2_15)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.7_0.2_15/0.5)]" />
              <div className="h-[11px] w-[11px] rounded-full bg-[oklch(0.82_0.18_85)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.82_0.18_85/0.4)]" />
              <div className="h-[11px] w-[11px] rounded-full bg-[oklch(0.72_0.2_145)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.72_0.2_145/0.4)]" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/15 select-none ml-1">
              screen preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-xl",
                  isRecording
                    ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                    : "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30",
                )}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {isRecording && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  )}
                  <span className={cn("relative h-1.5 w-1.5 rounded-full", isRecording ? "bg-red-400" : "bg-yellow-400")} />
                </span>
                {isRecording ? "Live" : "Paused"}
              </motion.div>
            )}
            {result && !isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400 ring-1 ring-emerald-500/30"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ready
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="relative h-full w-full pt-9">

          {/* ── Idle state ── */}
          {!isLive && !result && (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
              {/* Dot grid */}
              <div className="absolute inset-0 bg-[image:radial-gradient(circle,oklch(1_0_0/0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
              {/* Radial vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_30%,oklch(0.09_0.02_264/0.9)_100%)]" />
              {/* Top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[radial-gradient(ellipse,oklch(0.74_0.15_222/0.12)_0%,transparent_70%)] blur-xl" />

              {/* Viewfinder corner accents */}
              {[
                "top-3 left-3 border-t-2 border-l-2 rounded-tl-sm",
                "top-3 right-3 border-t-2 border-r-2 rounded-tr-sm",
                "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-sm",
                "bottom-3 right-3 border-b-2 border-r-2 rounded-br-sm",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={cn("absolute w-5 h-5 border-white/10", cls)}
                />
              ))}

              {/* Center icon cluster */}
              <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
                <div className="relative flex items-center justify-center">
                  {/* Outer pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.05, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute h-24 w-24 rounded-full border border-primary/30"
                  />
                  {/* Middle ring */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.12, 0.3] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute h-16 w-16 rounded-full border border-primary/40"
                  />
                  {/* Icon container */}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />
                    <Monitor className="h-5 w-5 text-white/25 relative z-10" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white/40 tracking-wide">
                    Ready to capture
                  </p>
                  <p className="mt-1 text-[11px] text-white/20 leading-relaxed max-w-[220px] mx-auto">
                    Choose a source below, then hit&nbsp;
                    <span className="text-primary/50 font-medium">Start Recording</span>
                  </p>
                </div>

                {/* No-signal indicator */}
                <div className="flex items-center gap-2 rounded-full bg-white/[0.03] px-3 py-1 ring-1 ring-white/[0.05]">
                  <div className="flex items-center gap-[2px]">
                    {[0.2, 0.45, 0.7, 0.45, 0.2].map((h, i) => (
                      <div
                        key={i}
                        className="w-[2px] rounded-full bg-white/12"
                        style={{ height: `${h * 10}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-white/15 uppercase">
                    No signal
                  </span>
                </div>
              </div>

              {/* Subtle horizontal scan line on idle */}
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/[0.08] to-transparent animate-preview-scan pointer-events-none" />
            </div>
          )}

          {/* ── Live state ── */}
          {isLive && (
            <>
              <video
                ref={liveRef}
                muted
                playsInline
                className={cn(
                  "h-full w-full object-contain transition-all duration-500",
                  isPaused ? "bg-black/60 brightness-75" : "bg-black/50",
                )}
              />

              {/* CRT scan line overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,oklch(0_0_0/0.03)_3px,oklch(0_0_0/0.03)_4px)]" />
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-line-scan opacity-60" />
              </div>

              {/* Play-failed overlay */}
              {livePlayFailed && (
                <button
                  onClick={retryPlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2.5 rounded-full bg-white/10 px-6 py-3.5 ring-1 ring-white/20 hover:bg-white/15 transition-all"
                  >
                    <Play className="h-5 w-5 text-white fill-white" />
                    <span className="text-sm font-semibold text-white">Click to enable preview</span>
                  </motion.div>
                </button>
              )}

              {/* Corner crosshairs */}
              {[
                "top-[2.5rem] left-3",
                "top-[2.5rem] right-3",
                "bottom-3 left-3",
                "bottom-3 right-3",
              ].map((pos, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-4 h-4 pointer-events-none z-20",
                    pos,
                    i < 2
                      ? i === 0
                        ? "border-t border-l border-white/20 rounded-tl"
                        : "border-t border-r border-white/20 rounded-tr"
                      : i === 2
                      ? "border-b border-l border-white/20 rounded-bl"
                      : "border-b border-r border-white/20 rounded-br",
                  )}
                />
              ))}

              {/* Bottom gradient vignette */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

              {/* ── HUD: top-left status ── */}
              <div className="absolute top-[2.75rem] left-4 flex items-center gap-2 z-20">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-2xl ring-1",
                    isRecording
                      ? "bg-red-950/80 ring-red-500/30"
                      : "bg-yellow-950/80 ring-yellow-500/30",
                  )}
                >
                  <span className="relative flex h-2 w-2">
                    {isRecording && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" />
                    )}
                    <span
                      className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        isRecording ? "bg-red-400" : "bg-yellow-300",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      isRecording ? "text-red-300" : "text-yellow-200",
                    )}
                  >
                    {isRecording ? "REC" : "PAUSED"}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-2xl ring-1 ring-white/[0.08]"
                >
                  <span className="font-mono text-xs tabular-nums text-white/80 tracking-wider">
                    {formatTimer(elapsed)}
                  </span>
                </motion.div>
              </div>

              {/* ── HUD: bottom audio meter ── */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08]"
                >
                  <div className="flex items-end gap-[2.5px] h-6">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const center = Math.abs(i - 9.5) / 9.5;
                      const barLevel = audioLevel * (1 - center * 0.4);
                      return (
                        <div
                          key={i}
                          className="w-[2.5px] rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.max(3, barLevel * 22 + (1 - center) * 2)}px`,
                            backgroundColor: audioLevel > 0.7
                              ? `oklch(0.7 0.2 15 / ${Math.max(0.25, barLevel * 0.9)})`
                              : `oklch(0.74 0.15 222 / ${Math.max(0.2, barLevel * 0.85)})`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider ml-1">
                    Audio
                  </span>
                </motion.div>
              )}

              {/* ── HUD: top-right frame info ── */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-[2.75rem] right-4 z-20 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-2xl ring-1 ring-white/[0.08]"
                >
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">60 fps</span>
                </motion.div>
              )}
            </>
          )}

          {/* ── Result / playback state ── */}
          {!isLive && result && (
            <div className="relative h-full w-full">
              <video
                src={result.url}
                autoPlay
                muted
                playsInline
                controls
                className="h-full w-full object-contain bg-black/50"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom bezel detail ── */}
      <div className="mx-auto mt-2 h-[3px] w-[40%] rounded-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>
  );
}

function SourceCards({
  value,
  onChange,
  onSelect,
  disabled,
}: {
  value: CaptureSurface;
  onChange: (v: CaptureSurface) => void;
  onSelect?: (v: CaptureSurface) => void;
  disabled?: boolean;
}) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(600px) rotateX(${(y - 0.5) * -12}deg) rotateY(${(x - 0.5) * 12}deg) scale3d(1.02,1.02,1.02)`;
  }, [disabled]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  }, [disabled]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {SOURCES.map(({ id, label, icon: Icon, description, tip }, idx) => {
        const active = value === id;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="perspective-[600px]"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(id);
                onSelect?.(id);
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "relative flex flex-col items-start gap-2.5 rounded-xl p-4 text-left w-full transition-all duration-200 ease-out text-balance overflow-hidden",
                "bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]",
                "hover:border-white/[0.18] hover:bg-white/[0.06]",
                "disabled:cursor-not-allowed disabled:opacity-30",
                active && [
                  "bg-white/[0.06] border-primary/30",
                  "shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.25)]",
                ],
              )}
            >
              {active && (
                <motion.div
                  layoutId="source-glow"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-primary/[0.08] to-transparent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 w-full">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                    active
                      ? "bg-gradient-primary text-white shadow-[0_0_20px_-4px_oklch(0.74_0.15_222/0.35)] ring-1 ring-white/10"
                      : "bg-white/[0.04] text-white/35 ring-1 ring-white/[0.04]",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <span
                    className={cn(
                      "block font-display text-sm font-semibold transition-colors truncate",
                      active ? "text-white" : "text-white/55",
                    )}
                  >
                    {label}
                  </span>
                  <span className="block text-[10px] text-white/25 mt-0.5 leading-tight hidden md:block">
                    {description}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-white/15 leading-tight italic hidden sm:block">
                {tip}
              </span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

function QualitySelector({
  value,
  onChange,
  disabled,
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
          "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ring-1 ring-white/[0.06]",
          "bg-white/[0.03] backdrop-blur-sm transition-all",
          "hover:bg-white/[0.06] hover:ring-white/[0.12]",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <Expand className="h-3.5 w-3.5 text-white/35" />
        <span className="text-white/65 font-medium">{value.label}</span>
        <svg className="w-3 h-3 text-white/25 ml-0.5" fill="none" viewBox="0 0 12 12">
          <path
            d="M3 5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
                onClick={() => {
                  onChange(preset);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                  value.short === preset.short
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold uppercase",
                    value.short === preset.short
                      ? "bg-gradient-primary text-white"
                      : "bg-white/[0.05] text-white/30",
                  )}
                >
                  {preset.short.replace("p", "")}
                </span>
                <div className="flex-1">
                  <span className="block font-medium leading-tight">{preset.label}</span>
                  <span className="block text-[10px] text-white/30 mt-0.5">
                    {preset.width}×{preset.height}
                  </span>
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
  status,
  includeAudio,
  onIncludeAudioChange,
  includeCamera,
  onIncludeCameraChange,
  onStart,
  onPause,
  onResume,
  onStop,
  source,
  quality,
  onQualityChange,
  annotationsEnabled,
  onAnnotationsChange,
  whiteboardActive,
  onWhiteboardChange,
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
  annotationsEnabled: boolean;
  onAnnotationsChange: (v: boolean) => void;
  whiteboardActive: boolean;
  onWhiteboardChange: (v: boolean) => void;
}) {
  const idle = status === "idle";

  return (
    <div className="flex flex-col items-center gap-4">
      {idle && (
        <div className="flex items-center gap-2 mb-1">
          <QualitySelector value={quality} onChange={onQualityChange} disabled={!idle} />
        </div>
      )}
      <div className="flex items-center gap-3">
        {idle && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[20px] bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 blur-2xl opacity-50 animate-pulse" />
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
            </div>
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
              <Button
                variant="destructive"
                size="lg"
                onClick={onStop}
                className="group shadow-[0_0_0_1px_oklch(0.63_0.245_27/0.3),0_0_30px_oklch(0.63_0.245_27/0.1)]"
              >
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
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]"
          >
            <Switch checked={includeAudio} onCheckedChange={onIncludeAudioChange} />
            <span className="text-white/50 select-none flex items-center gap-1.5">
              <Mic className="h-3 w-3" />
              Audio
            </span>
          </motion.label>
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]"
          >
            <Switch checked={includeCamera} onCheckedChange={onIncludeCameraChange} />
            <span className="text-white/50 select-none flex items-center gap-1.5">
              <Camera className="h-3 w-3" />
              Webcam
            </span>
          </motion.label>
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]"
          >
            <Switch checked={annotationsEnabled} onCheckedChange={onAnnotationsChange} />
            <span className="text-white/50 select-none flex items-center gap-1.5">
              <Pencil className="h-3 w-3" />
              Annotate
            </span>
          </motion.label>
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-xs ring-1 backdrop-blur-sm transition-all",
              whiteboardActive
                ? "bg-primary/15 ring-primary/30 hover:bg-primary/20 hover:ring-primary/40"
                : "bg-white/[0.03] ring-white/[0.06] hover:bg-white/[0.06] hover:ring-white/[0.12]",
            )}
          >
            <Switch checked={whiteboardActive} onCheckedChange={onWhiteboardChange} />
            <span className={cn(
              "select-none flex items-center gap-1.5",
              whiteboardActive ? "text-primary/80" : "text-white/50",
            )}>
              <Monitor className="h-3 w-3" />
              Whiteboard
            </span>
          </motion.label>
        </div>
      )}
    </div>
  );
}

function RecordingResultPanel({
  result,
  onReset,
  onEdit,
}: {
  result: RecordingResult;
  onReset: () => void;
  onEdit?: () => void;
}) {
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
        if ((err as DOMException).name === "AbortError") {
          setSaveState("idle");
          return;
        }
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
    {
      icon: MonitorPlay,
      label: "Resolution",
      value: formatResolution(result.width, result.height),
    },
    { icon: HardDrive, label: "Size", value: formatBytes(result.sizeBytes) },
    {
      icon: Calendar,
      label: "Recorded",
      value: result.createdAt.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-deep rounded-2xl p-6 shadow-elegant"
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
          <div key={label} className="glass rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-white/30 mb-1">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-display text-sm font-semibold text-white/80">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="hero"
          size="lg"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="group"
        >
          {saveState === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {saveState === "done"
            ? "Saved"
            : saveState === "saving"
              ? "Saving\u2026"
              : "Save Recording"}
        </Button>
        <Button variant="glass" size="lg" onClick={onEdit} className="group gap-2">
          <Film className="h-4 w-4" />
          Edit Video
        </Button>
        <Button variant="glass" size="lg" onClick={onReset} className="group">
          <RotateCcw className="h-4 w-4" />
          New Recording
        </Button>
      </div>
    </motion.div>
  );
}

function TrustMetrics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-14 text-center"
    >
      <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
        {[
          { value: "Zero", label: "installs" },
          { value: "100%", label: "private" },
          { value: "No", label: "watermark" },
          { value: "4K", label: "quality" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-display text-xl font-bold text-white/50">{value}</p>
            <p className="text-[11px] text-white/20 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </motion.div>
  );
}

function Index() {
  const [source, setSource] = useState<CaptureSurface>("monitor");
  const [whiteboardActive, setWhiteboardActive] = useState(false);
  const [editorBlob, setEditorBlob] = useState<Blob | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [teleprompterActive, setTeleprompterActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduleActive, setScheduleActive] = useState(false);
  const scheduleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated, user, logout } = useAuth();
  const {
    status,
    elapsed,
    countdown,
    stream,
    result,
    error,
    cropRect,
    multiStreams,
    includeAudio,
    setIncludeAudio,
    includeCamera,
    setIncludeCamera,
    cameraStream,
    cameraPosition,
    setCameraPosition,
    cameraSettings,
    setCameraSettings,
    quality,
    setQuality,
    fps,
    setFps,
    noiseSuppressionEnabled,
    setNoiseSuppressionEnabled,
    autoStopMinutes,
    setAutoStopMinutes,
    startRecording,
    cancelCountdown,
    confirmCrop,
    cancelCrop,
    addMonitorStream,
    startMultiRecording,
    cancelMultiSetup,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
    annotationsEnabled,
    setAnnotationsEnabled,
    annotationCanvasRef,
    setupAnnotationCanvas,
    clearAnnotationCanvas,
  } = useScreenRecorder();

  const isIdle = status === "idle";
  const isLiveStatus = status === "recording" || status === "paused";
  const showClickFX = status === "recording" || whiteboardActive;
  const showCursorFX = status === "recording" || whiteboardActive;

  // Save to history whenever a recording completes
  useEffect(() => {
    if (result) saveToHistory(result);
  }, [result]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement)?.isContentEditable;

      // Block ALL shortcuts when user is typing in an input/textarea
      if (isInput) return;

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "r":
            e.preventDefault();
            if (status === "idle" && !result) startRecording(source);
            break;
          case "n":
            e.preventDefault();
            if (result || status !== "idle") reset();
            break;
          case "h":
            e.preventDefault();
            setShowHistory((v) => !v);
            break;
          case "k":
            e.preventDefault();
            setShowShortcuts((v) => !v);
            break;
          case "e":
            e.preventDefault();
            if (result) setEditorBlob(result.blob);
            break;
          case "t":
            e.preventDefault();
            setTeleprompterActive((v) => !v);
            break;
          case "w":
            e.preventDefault();
            setWhiteboardActive((v) => !v);
            break;
          case "a":
            e.preventDefault();
            setAnnotationsEnabled((v) => !v);
            if (!annotationsEnabled) setupAnnotationCanvas(1920, 1080);
            break;
        }
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        if (status === "recording") pauseRecording();
        else if (status === "paused") resumeRecording();
      }
      if (e.key === "Escape") {
        if (status === "recording" || status === "paused") stopRecording();
        else if (showHistory) setShowHistory(false);
        else if (showShortcuts) setShowShortcuts(false);
        else if (teleprompterActive) setTeleprompterActive(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, result, source, showHistory, showShortcuts, teleprompterActive, annotationsEnabled,
      startRecording, pauseRecording, resumeRecording, stopRecording, reset, setAnnotationsEnabled, setupAnnotationCanvas]);

  // Scheduled recording
  const handleSchedule = useCallback(() => {
    if (!scheduledTime) return;
    const target = new Date(scheduledTime).getTime();
    const now = Date.now();
    const delay = target - now;
    if (delay <= 0) return;
    setScheduleActive(true);
    scheduleTimerRef.current = setTimeout(() => {
      startRecording(source);
      setScheduleActive(false);
    }, delay);
  }, [scheduledTime, source, startRecording]);

  const cancelSchedule = useCallback(() => {
    if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
    setScheduleActive(false);
  }, []);

  // Clean up schedule timer on unmount
  useEffect(() => {
    return () => {
      if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
    };
  }, []);

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
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ── Background layer ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.74_0.15_222/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,oklch(0.72_0.16_200/0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,oklch(0.74_0.15_222/0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_50%,oklch(0.7_0.14_250/0.06),transparent)]" />
        <div className="absolute inset-0 bg-[image:radial-gradient(oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Floating decorative orbs */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-[120px] animate-float-1 animate-blob-pulse will-change-transform" />
        <div
          className="absolute -bottom-64 -right-48 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-blue-500/8 to-purple-500/8 blur-[100px] animate-float-2 animate-blob-pulse will-change-transform"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/8 to-primary/5 blur-[100px] animate-float-3 animate-blob-pulse will-change-transform"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute top-1/4 -right-32 w-[350px] h-[350px] rounded-full bg-gradient-to-bl from-violet-500/6 to-transparent blur-[90px] animate-drift animate-blob-pulse will-change-transform"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-teal-500/6 to-transparent blur-[80px] animate-drift animate-blob-pulse will-change-transform"
          style={{ animationDelay: "-5s" }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/8 animate-twinkle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* ── Noise texture overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Overlays ── */}
      <ClickFX active={showClickFX} />
      <CursorFX
        active={showCursorFX}
        whiteboardActive={whiteboardActive}
        brushSize={4}
        brushColor="#ffffff"
        toolName="Pen"
      />
      <WhiteboardMode active={whiteboardActive} onClose={() => setWhiteboardActive(false)} />
      <CountdownOverlay countdown={countdown} onCancel={cancelCountdown} status={status} />
      <CameraOverlay
        cameraStream={cameraStream}
        position={cameraPosition}
        onPositionChange={setCameraPosition}
        settings={cameraSettings}
        onSettingsChange={setCameraSettings}
        active={includeCamera && (status === "idle" || status === "countdown")}
      />

      {/* ── New feature overlays ── */}
      <SpotlightOverlay active={isLiveStatus} />
      <FloatingMiniBar
        status={status}
        elapsed={elapsed}
        onPause={pauseRecording}
        onResume={resumeRecording}
        onStop={stopRecording}
      />
      <TeleprompterOverlay
        active={teleprompterActive}
        onClose={() => setTeleprompterActive(false)}
        isRecording={status === "recording"}
      />
      <RecordingHistory open={showHistory} onClose={() => setShowHistory(false)} />
      <KeyboardShortcutsPanel open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {status === "crop" && stream && (
        <CropOverlay stream={stream} onConfirm={confirmCrop} onCancel={cancelCrop} />
      )}

      {status === "multi-setup" && (
        <MultiMonitorSetup
          streams={multiStreams}
          onAddMonitor={addMonitorStream}
          onStart={startMultiRecording}
          onCancel={cancelMultiSetup}
        />
      )}

      {(status === "recording" || status === "paused") && (
        <DrawingOverlay
          enabled={annotationsEnabled}
          annotationCanvasRef={annotationCanvasRef}
          recordingWidth={stream?.getVideoTracks()[0]?.getSettings().width ?? 1920}
          recordingHeight={stream?.getVideoTracks()[0]?.getSettings().height ?? 1080}
          onClear={clearAnnotationCanvas}
        />
      )}

      {/* ── Main content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-5xl px-4 py-6 md:py-12"
      >
        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-[0_0_20px_-4px_oklch(0.74_0.15_222/0.3)]">
              <Video className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-white/80">
              ScreenFlow
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* History button */}
            <button
              onClick={() => setShowHistory(true)}
              title="Recording History (Alt+H)"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]"
            >
              <History className="h-4 w-4" />
            </button>
            {/* Keyboard shortcuts button */}
            <button
              onClick={() => setShowShortcuts(true)}
              title="Keyboard Shortcuts (Alt+K)"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            {/* Teleprompter button */}
            <button
              onClick={() => setTeleprompterActive((v) => !v)}
              title="Teleprompter (Alt+T)"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition-all",
                teleprompterActive
                  ? "bg-primary/15 text-primary/80 ring-primary/25"
                  : "text-white/30 ring-white/[0.06] hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]",
              )}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <div className="h-5 w-px bg-white/[0.06] hidden md:block" />
            <span className="hidden md:flex items-center gap-1.5 rounded-full bg-white/[0.03] px-3 py-1 text-[11px] text-white/30 ring-1 ring-white/[0.06]">
              <Sparkles className="h-3 w-3 text-white/20" />
              No installs
            </span>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 ring-1 ring-white/[0.06] backdrop-blur-sm">
                  <User className="h-3 w-3" />
                  {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/60"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70"
              >
                Sign in
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── Hero ── */}
        <motion.div variants={fadeUp} className="text-center mb-8 md:mb-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-white/40 ring-1 ring-white/[0.06] backdrop-blur-sm mb-5"
          >
            <Sparkles className="h-3 w-3 text-primary/60" />
            Browser-based &middot; No installs &middot; 100% private
          </motion.span>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-4"
          >
            <span className="relative inline-block mb-2">
              <span className="absolute -inset-x-16 -inset-y-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-[80px]" />
              {"Record your screen".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.25 + i * 0.15,
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="inline-block mr-[0.3em] last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="text-gradient bg-[length:200%_auto] hero-animate-gradient inline-block pb-1">
              in stunning quality
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-sm sm:text-base text-white/40 max-w-xl mx-auto leading-relaxed mb-6"
          >
            Capture your display in HD, Full HD or 4K directly from the browser.
            <br className="hidden sm:block" />
            No installs, no watermarks, no data leaving your machine.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex items-center justify-center gap-2 flex-wrap"
          >
            {FEATURES.map(({ icon: Icon, label }, fi) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + fi * 0.08, duration: 0.4 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/35 ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white/50 hover:ring-white/[0.12]"
              >
                <Icon className="h-3 w-3 text-primary/40" />
                {label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Error ── */}
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

        {/* ── Preview ── */}
        <motion.div variants={fadeUp} className="mb-5">
          {/* Subtle label above preview */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
              <MonitorPlay className="h-3 w-3" />
              Output Preview
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <RecordingPreview stream={stream} status={status} elapsed={elapsed} result={result} />
        </motion.div>

        {/* ── Source cards ── */}
        <AnimatePresence mode="wait">
          {isIdle && !result && (
            <motion.div
              key="sources"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <SourceCards value={source} onChange={setSource} disabled={!isIdle} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Advanced Settings ── */}
        <AnimatePresence>
          {isIdle && !result && (
            <motion.div
              key="advanced-settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mb-4"
            >
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-white/[0.025] px-4 py-3 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.04] hover:ring-white/[0.1]"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4 text-white/30" />
                  <span className="text-xs font-medium text-white/45">Advanced Settings</span>
                  {/* Active badges */}
                  <div className="flex items-center gap-1.5">
                    {fps !== 60 && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono text-primary/70">{fps}fps</span>
                    )}
                    {noiseSuppressionEnabled && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-400/70">Noise filter</span>
                    )}
                    {autoStopMinutes > 0 && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400/70">Auto-stop {autoStopMinutes}m</span>
                    )}
                    {scheduleActive && (
                      <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-400/70 flex items-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                        </span>
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
                {showAdvanced
                  ? <ChevronUp className="h-4 w-4 text-white/20" />
                  : <ChevronDown className="h-4 w-4 text-white/20" />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.05] space-y-5">

                      {/* FPS */}
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <Gauge className="h-3.5 w-3.5 text-white/25" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/25">Frame Rate</span>
                        </div>
                        <div className="flex gap-2">
                          {([30, 60] as const).map((f) => (
                            <button
                              key={f}
                              onClick={() => setFps(f)}
                              className={cn(
                                "flex-1 rounded-lg py-2 text-xs font-semibold ring-1 transition-all",
                                fps === f
                                  ? "bg-primary/15 text-primary/80 ring-primary/30"
                                  : "bg-white/[0.03] text-white/35 ring-white/[0.07] hover:bg-white/[0.06] hover:text-white/55",
                              )}
                            >
                              {f} FPS
                            </button>
                          ))}
                        </div>
                        <p className="mt-1.5 text-[10px] text-white/20">Higher FPS produces smoother recordings but larger files</p>
                      </div>

                      {/* Noise suppression */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {noiseSuppressionEnabled
                            ? <Volume2 className="h-4 w-4 text-emerald-400/60" />
                            : <VolumeX className="h-4 w-4 text-white/25" />}
                          <div>
                            <p className="text-xs font-medium text-white/50">AI Noise Suppression</p>
                            <p className="text-[10px] text-white/25">Removes background noise from microphone</p>
                          </div>
                        </div>
                        <Switch
                          checked={noiseSuppressionEnabled}
                          onCheckedChange={setNoiseSuppressionEnabled}
                        />
                      </div>

                      {/* Auto-stop */}
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <Timer className="h-3.5 w-3.5 text-white/25" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/25">Auto-Stop Timer</span>
                          {autoStopMinutes > 0 && (
                            <span className="ml-auto text-[11px] font-mono text-amber-400/60">{autoStopMinutes} min</span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {[0, 5, 10, 15, 30, 60].map((m) => (
                            <button
                              key={m}
                              onClick={() => setAutoStopMinutes(m)}
                              className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-all",
                                autoStopMinutes === m
                                  ? "bg-amber-500/15 text-amber-400/80 ring-amber-500/30"
                                  : "bg-white/[0.03] text-white/35 ring-white/[0.07] hover:bg-white/[0.06]",
                              )}
                            >
                              {m === 0 ? "Off" : `${m}m`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scheduled Recording */}
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <Calendar className="h-3.5 w-3.5 text-white/25" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/25">Scheduled Recording</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            disabled={scheduleActive}
                            className="flex-1 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/60 ring-1 ring-white/[0.08] outline-none transition-all focus:ring-primary/30 disabled:opacity-40"
                          />
                          {scheduleActive ? (
                            <button
                              onClick={cancelSchedule}
                              className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-400/80 ring-1 ring-red-500/25 transition-all hover:bg-red-500/25"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={handleSchedule}
                              disabled={!scheduledTime}
                              className="rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-medium text-violet-400/80 ring-1 ring-violet-500/25 transition-all hover:bg-violet-500/25 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Schedule
                            </button>
                          )}
                        </div>
                        {scheduleActive && (
                          <p className="mt-1.5 text-[10px] text-violet-400/50 flex items-center gap-1">
                            <span className="relative flex h-1.5 w-1.5 mr-1">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                            </span>
                            Waiting to record at {new Date(scheduledTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Controls ── */}
        <motion.div variants={fadeUp} className="glass rounded-2xl p-5 shadow-elegant">
          <ControlBar
            status={status}
            includeAudio={includeAudio}
            onIncludeAudioChange={setIncludeAudio}
            includeCamera={includeCamera}
            onIncludeCameraChange={setIncludeCamera}
            onStart={() => startRecording(source)}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
            source={source}
            quality={quality}
            onQualityChange={setQuality}
            annotationsEnabled={annotationsEnabled}
            onAnnotationsChange={(v) => {
              setAnnotationsEnabled(v);
              if (v) setupAnnotationCanvas(1920, 1080);
            }}
            whiteboardActive={whiteboardActive}
            onWhiteboardChange={setWhiteboardActive}
          />
        </motion.div>

        {/* ── Result ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <RecordingResultPanel result={result} onReset={reset} onEdit={() => setEditorBlob(result.blob)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trust metrics ── */}
        <TrustMetrics />

        {/* ── Footer ── */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-2 mt-8 text-xs text-white/15"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-white/10" />
          Recordings never leave your device — everything is processed locally.
        </motion.div>
      </motion.div>

      {/* ── Video Editor ── */}
      {editorBlob && (
        <VideoEditor blob={editorBlob} onClose={() => setEditorBlob(null)} />
      )}
    </main>
  );
}
