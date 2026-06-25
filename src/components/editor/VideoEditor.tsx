import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  Scissors,
  Layers,
  Crop,
  Play,
  Pause,
  Download,
  Loader2,
  Trash2,
  Plus,
  RotateCcw,
  Check,
  Subtitles,
  Music,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  trimVideo,
  cropVideo,
  resizeVideo,
  mergeClips,
  processWithEffects,
  type CropRect,
  type CaptionEntry,
} from "@/lib/video-editor";

type Tab = "trim" | "merge" | "crop" | "captions" | "music";

const ASPECTS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "9:16", w: 9, h: 16 },
];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface VideoEditorProps {
  blob: Blob;
  onClose: () => void;
}

export function VideoEditor({ blob, onClose }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<Tab>("trim");

  // Trim
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Merge
  const [mergeClips, setMergeClips] = useState<Blob[]>([blob]);

  // Crop
  const [cropX, setCropX] = useState(0.1);
  const [cropY, setCropY] = useState(0.1);
  const [cropW, setCropW] = useState(0.8);
  const [cropH, setCropH] = useState(0.8);
  const [outputW, setOutputW] = useState(1920);
  const [outputH, setOutputH] = useState(1080);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [vidW, setVidW] = useState(1920);
  const [vidH, setVidH] = useState(1080);

  // Speed
  const [speed, setSpeed] = useState(1);

  // Captions
  const [captions, setCaptions] = useState<CaptionEntry[]>([]);
  const [newCaptionText, setNewCaptionText] = useState("");
  const [newCaptionStart, setNewCaptionStart] = useState(0);
  const [newCaptionEnd, setNewCaptionEnd] = useState(0);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);

  // Music
  const [musicBlob, setMusicBlob] = useState<Blob | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const musicInputRef = useRef<HTMLInputElement>(null);

  // Processing
  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");

  // Init
  useEffect(() => {
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setTrimEnd(duration);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  useEffect(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const onMeta = () => {
      setDuration(v.duration);
      setTrimEnd(v.duration);
      setVidW(v.videoWidth || 1920);
      setVidH(v.videoHeight || 1080);
    };
    const onTime = () => setCurrentTime(v.currentTime);
    const onEnd = () => setPlaying(false);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [videoUrl]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const seekTo = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // ── Trim ──
  const handleTrimStart = (val: number) => {
    if (val >= trimEnd) return;
    setTrimStart(val);
    seekTo(val);
  };

  const handleTrimEnd = (val: number) => {
    if (val <= trimStart) return;
    setTrimEnd(val);
    seekTo(val);
  };

  const applyTrim = async () => {
    const actualEnd = Math.min(trimEnd, duration);
    if (actualEnd - trimStart < 0.5) return;
    setProcessing(true);
    setProcessingLabel("Trimming video\u2026");
    try {
      const result = await trimVideo(blob, trimStart, actualEnd, {
        width: vidW,
        height: vidH,
        fps: 30,
      });
      setResultBlob(result);
    } catch (err) {
      console.error("Trim failed", err);
    } finally {
      setProcessing(false);
    }
  };

  // ── Merge ──
  const addClip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const vidFiles = files.filter((f) => f.type.startsWith("video/"));
    if (vidFiles.length === 0) return;
    setMergeClips((prev) => [...prev, ...vidFiles]);
    e.target.value = "";
  };

  const removeClip = (idx: number) => {
    setMergeClips((prev) => prev.filter((_, i) => i !== idx));
  };

  const applyMerge = async () => {
    if (mergeClips.length < 2) return;
    setProcessing(true);
    setProcessingLabel("Merging clips\u2026");
    try {
      const result = await mergeClips(mergeClips, { width: vidW, height: vidH, fps: 30 });
      setResultBlob(result);
    } catch (err) {
      console.error("Merge failed", err);
    } finally {
      setProcessing(false);
    }
  };

  // ── Crop / Resize ──
  const setAspect = (w: number, h: number) => {
    const r = w / h;
    setCropH(cropW / r);
  };

  const applyCrop = async () => {
    const rect: CropRect = {
      x: Math.round(cropX * vidW),
      y: Math.round(cropY * vidH),
      width: Math.round(cropW * vidW),
      height: Math.round(cropH * vidH),
    };
    if (rect.width < 16 || rect.height < 16) return;
    setProcessing(true);
    setProcessingLabel(outputW === vidW && outputH === vidH ? "Cropping video\u2026" : "Resizing video\u2026");
    try {
      const cropped = await cropVideo(blob, rect, rect.width, rect.height, { width: vidW, height: vidH, fps: 30 });
      if (outputW !== rect.width || outputH !== rect.height) {
        const resized = await resizeVideo(cropped, outputW, outputH, { width: outputW, height: outputH, fps: 30 });
        setResultBlob(resized);
      } else {
        setResultBlob(cropped);
      }
    } catch (err) {
      console.error("Crop failed", err);
    } finally {
      setProcessing(false);
    }
  };

  // ── Result download ──
  useEffect(() => {
    if (resultBlob) {
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [resultBlob]);

  const downloadResult = () => {
    if (!resultBlob) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `screencapture-pro_edited_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── Captions ──
  const addCaption = () => {
    if (!newCaptionText.trim()) return;
    const id = crypto.randomUUID();
    setCaptions((prev) => [
      ...prev,
      { id, start: newCaptionStart, end: newCaptionEnd, text: newCaptionText.trim() },
    ]);
    setNewCaptionText("");
  };

  const removeCaption = (id: string) => {
    setCaptions((prev) => prev.filter((c) => c.id !== id));
    if (editingCaptionId === id) setEditingCaptionId(null);
  };

  const updateCaption = (id: string, updates: Partial<CaptionEntry>) => {
    setCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // ── Music ──
  const handleMusicFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setMusicBlob(file);
    }
    e.target.value = "";
  };

  const resetEditor = () => {
    setResultBlob(null);
    setResultUrl("");
    setTrimStart(0);
    setTrimEnd(duration);
    setMergeClips([blob]);
    setSpeed(1);
    setCaptions([]);
    setMusicBlob(null);
    setMusicVolume(0.5);
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-black/80 backdrop-blur-2xl ring-1 ring-white/[0.06] shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-[0_0_16px_-4px_oklch(0.74_0.15_222/0.3)]">
              <Layers className="h-4 w-4 text-white" />
            </span>
            <h2 className="font-display text-lg font-semibold text-white/90">
              {resultBlob ? "Edit complete" : "Video Editor"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Preview ── */}
        <div className="px-6 py-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/60 ring-1 ring-white/[0.06]">
            {resultBlob ? (
              <video
                src={resultUrl}
                autoPlay
                muted
                playsInline
                controls
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            )}

            {/* Crop overlay preview */}
            {tab === "crop" && !resultBlob && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute border-2 border-primary/60 bg-primary/5"
                  style={{
                    left: `${cropX * 100}%`,
                    top: `${cropY * 100}%`,
                    width: `${cropW * 100}%`,
                    height: `${cropH * 100}%`,
                  }}
                >
                  <div className="absolute -top-3 -left-3 h-6 w-6 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-3 -right-3 h-6 w-6 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-primary" />
                </div>
              </div>
            )}

            {/* Play button overlay when paused */}
            {!playing && !resultBlob && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                  <Play className="h-6 w-6 text-white/80 ml-0.5" />
                </span>
              </button>
            )}

            {/* Processing overlay */}
            {processing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-white/60 font-medium">{processingLabel}</span>
              </div>
            )}
          </div>

          {/* Scrubber */}
          {!resultBlob && (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all ring-1 ring-white/[0.06]"
              >
                {playing ? <Pause className="h-3.5 w-3.5 text-white/60" /> : <Play className="h-3.5 w-3.5 text-white/60 ml-0.5" />}
              </button>
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="flex-1 h-1 accent-primary/60 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-white/40 tabular-nums shrink-0 w-20 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        {!resultBlob && (
          <div className="flex items-center gap-1 px-6 border-b border-white/[0.06]">
            {[
              { id: "trim" as Tab, icon: Scissors, label: "Trim" },
              { id: "merge" as Tab, icon: Layers, label: "Merge" },
              { id: "crop" as Tab, icon: Crop, label: "Crop / Resize" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px",
                  tab === id
                    ? "border-primary text-white border-b-primary"
                    : "border-transparent text-white/30 hover:text-white/50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab Content ── */}
        <div className="px-6 py-4">
          {resultBlob ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Check className="h-6 w-6 text-emerald-400" />
              </span>
              <p className="text-sm text-white/60 text-center max-w-md">
                Your video has been processed. Download it or start over.
              </p>
              <div className="flex gap-3 mt-2">
                <Button variant="hero" size="lg" onClick={downloadResult} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="glass" size="lg" onClick={resetEditor} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Edit again
                </Button>
              </div>
            </div>
          ) : tab === "trim" ? (
            <div className="space-y-4">
              <p className="text-xs text-white/30">
                Drag the handles to set the in and out points, then trim.
              </p>

              {/* Timeline */}
              <div className="relative h-8">
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-white/[0.06]" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary/40"
                  style={{
                    left: `${duration > 0 ? (trimStart / duration) * 100 : 0}%`,
                    width: `${duration > 0 ? ((trimEnd - trimStart) / duration) * 100 : 0}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={trimStart}
                  onChange={(e) => handleTrimStart(Number(e.target.value))}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                  style={{ direction: "ltr" }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={trimEnd}
                  onChange={(e) => handleTrimEnd(Number(e.target.value))}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-primary/30"
                  style={{ direction: "ltr" }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/40">Start: {formatTime(trimStart)}</span>
                <span className="font-mono text-white/60">
                  {formatTime(trimEnd - trimStart)}
                </span>
                <span className="font-mono text-white/40">End: {formatTime(trimEnd)}</span>
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={applyTrim}
                disabled={processing || trimEnd - trimStart < 0.5}
                className="w-full gap-2"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
                {processing ? "Trimming\u2026" : "Apply Trim"}
              </Button>
            </div>
          ) : tab === "merge" ? (
            <div className="space-y-4">
              <p className="text-xs text-white/30">
                Add video clips and merge them together in sequence.
              </p>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {mergeClips.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.06]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.05] text-[10px] font-bold text-white/30">
                        {i + 1}
                      </span>
                      <span className="text-sm text-white/50">
                        Clip {i + 1} {(c.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {i > 0 && (
                        <button
                          onClick={() => removeClip(i)}
                          className="flex h-7 w-7 items-center justify-center rounded text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={addClip}
                className="hidden"
              />

              <div className="flex gap-2">
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add clips
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={applyMerge}
                  disabled={processing || mergeClips.length < 2}
                  className="flex-1 gap-2"
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                  {processing ? "Merging\u2026" : `Merge ${mergeClips.length} clips`}
                </Button>
              </div>
            </div>
          ) : (
            /* ── Crop / Resize ── */
            <div className="space-y-4">
              <p className="text-xs text-white/30">
                Adjust the crop area and set output dimensions.
              </p>

              {/* Crop controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Crop X
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.01}
                    value={cropX}
                    onChange={(e) => setCropX(Number(e.target.value))}
                    className="w-full h-1 accent-primary/60"
                  />
                  <span className="text-[10px] font-mono text-white/20">{Math.round(cropX * vidW)}px</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Crop Y
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.01}
                    value={cropY}
                    onChange={(e) => setCropY(Number(e.target.value))}
                    className="w-full h-1 accent-primary/60"
                  />
                  <span className="text-[10px] font-mono text-white/20">{Math.round(cropY * vidH)}px</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Crop Width
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={cropW}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCropW(val);
                      if (aspectLocked) setCropH(val / (aspectLocked ? vidW / vidH : 1));
                    }}
                    className="w-full h-1 accent-primary/60"
                  />
                  <span className="text-[10px] font-mono text-white/20">{Math.round(cropW * vidW)}px</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Crop Height
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={cropH}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCropH(val);
                      if (aspectLocked) setCropW(val * (vidW / vidH));
                    }}
                    className="w-full h-1 accent-primary/60"
                  />
                  <span className="text-[10px] font-mono text-white/20">{Math.round(cropH * vidH)}px</span>
                </div>
              </div>

              {/* Aspect ratio presets */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1.5 block">
                  Aspect ratio
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ASPECTS.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => setAspect(a.w, a.h)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-all ring-1",
                        Math.abs((cropW / cropH) - (a.w / a.h)) < 0.01
                          ? "bg-primary/15 ring-primary/30 text-primary/80"
                          : "bg-white/[0.03] ring-white/[0.06] text-white/30 hover:text-white/50",
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setAspectLocked(!aspectLocked)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all ring-1",
                      aspectLocked
                        ? "bg-white/[0.06] ring-white/[0.1] text-white/50"
                        : "bg-white/[0.03] ring-white/[0.06] text-white/30",
                    )}
                  >
                    Lock {aspectLocked ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* Output dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Output Width
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={7680}
                    value={outputW}
                    onChange={(e) => setOutputW(Math.max(16, Number(e.target.value)))}
                    className="w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70 ring-1 ring-white/[0.06] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/20 mb-1 block">
                    Output Height
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={4320}
                    value={outputH}
                    onChange={(e) => setOutputH(Math.max(16, Number(e.target.value)))}
                    className="w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70 ring-1 ring-white/[0.06] outline-none"
                  />
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={applyCrop}
                disabled={processing}
                className="w-full gap-2"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4" />}
                {processing ? "Processing\u2026" : "Apply Crop & Resize"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
