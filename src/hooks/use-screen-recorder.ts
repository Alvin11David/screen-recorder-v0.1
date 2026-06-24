import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "countdown" | "recording" | "paused";
export type CaptureSurface = "monitor" | "window" | "browser";

export type QualityPreset = {
  label: string;
  short: string;
  width: number;
  height: number;
  bitrateMultiplier: number;
};

export const QUALITY_PRESETS: QualityPreset[] = [
  { label: "720p HD", short: "720p", width: 1280, height: 720, bitrateMultiplier: 0.12 },
  { label: "1080p Full HD", short: "1080p", width: 1920, height: 1080, bitrateMultiplier: 0.15 },
  { label: "1440p QHD", short: "1440p", width: 2560, height: 1440, bitrateMultiplier: 0.18 },
  { label: "4K Ultra HD", short: "4K", width: 3840, height: 2160, bitrateMultiplier: 0.18 },
];

export interface RecordingResult {
  url: string;
  blob: Blob;
  durationSeconds: number;
  width: number;
  height: number;
  sizeBytes: number;
  createdAt: Date;
  mimeType: string;
}

const pickMimeType = (): string => {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "video/webm";
};

export function useScreenRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [quality, setQuality] = useState<QualityPreset>(QUALITY_PRESETS[1]);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackSettingsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    clearTimer();
    timerRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000);
    }, 250);
  }, []);

  const beginCapture = useCallback(
    async (surface: CaptureSurface) => {
      setError(null);
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
        setError("Screen recording isn't supported in this browser.");
        setStatus("idle");
        return;
      }

      try {
        const constraints: DisplayMediaStreamOptions & { displaySurface?: string } = {
          displaySurface: surface,
          video: {
            frameRate: { ideal: 60 },
            width: { ideal: quality.width },
            height: { ideal: quality.height },
          } as MediaTrackConstraints,
          audio: includeAudio
            ? { echoCancellation: false, noiseSuppression: false, sampleRate: 44100 }
            : false,
        };
        const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);

        const [videoTrack] = displayStream.getVideoTracks();
        const settings = videoTrack.getSettings();
        const width = settings.width ?? quality.width;
        const height = settings.height ?? quality.height;
        trackSettingsRef.current = { width, height };

        const pixels = width * height;
        const bitrate = Math.min(Math.round(pixels * quality.bitrateMultiplier) + 8_000_000, 50_000_000);

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(displayStream, {
          mimeType,
          videoBitsPerSecond: bitrate,
          audioBitsPerSecond: 128_000,
        });

        chunksRef.current = [];
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
        };

        const handleStop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setResult({
            url,
            blob,
            durationSeconds: accumulatedRef.current,
            width: trackSettingsRef.current.width,
            height: trackSettingsRef.current.height,
            sizeBytes: blob.size,
            createdAt: new Date(),
            mimeType,
          });
          displayStream.getTracks().forEach((t) => t.stop());
          setStream(null);
          setStatus("idle");
          clearTimer();
          triggerDownload(blob);
        };

        recorder.onstop = handleStop;
        videoTrack.addEventListener("ended", () => {
          if (recorderRef.current && recorderRef.current.state !== "inactive") {
            accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
            recorderRef.current.stop();
          }
        });

        recorderRef.current = recorder;
        accumulatedRef.current = 0;
        setElapsed(0);
        setResult(null);
        recorder.start(1000);
        setStream(displayStream);
        setStatus("recording");
        startTimer();
      } catch (err) {
        const e = err as DOMException;
        if (e.name === "NotAllowedError") {
          setError("Permission denied. Please allow screen sharing to start recording.");
        } else {
          setError(e.message || "Could not start screen recording.");
        }
        setStatus("idle");
      }
    },
    [includeAudio, quality, startTimer],
  );

  const startRecording = useCallback(
    (surface: CaptureSurface = "monitor") => {
      setCountdown(3);
      setStatus("countdown");
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            beginCapture(surface);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [beginCapture],
  );

  const cancelCountdown = useCallback(() => {
    setStatus("idle");
    setCountdown(0);
  }, []);

  const pauseRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
      clearTimer();
      setElapsed(accumulatedRef.current);
      setStatus("paused");
    }
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      startTimer();
      setStatus("recording");
    }
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      if (recorder.state === "recording") {
        accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
      }
      recorder.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setElapsed(0);
    accumulatedRef.current = 0;
  }, [result]);

  useEffect(() => {
    return () => {
      clearTimer();
      recorderRef.current?.state !== "inactive" && recorderRef.current?.stop();
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    elapsed,
    countdown,
    stream,
    result,
    error,
    includeAudio,
    setIncludeAudio,
    quality,
    setQuality,
    startRecording,
    cancelCountdown,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
  };
}

function triggerDownload(blob: Blob) {
  const suggestedName = `screencapture-pro_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.webm`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
