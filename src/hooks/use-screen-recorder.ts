import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "paused";
export type CaptureSurface = "monitor" | "window" | "browser";

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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [includeAudio, setIncludeAudio] = useState(true);

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

  const startRecording = useCallback(
    async (surface: CaptureSurface = "monitor") => {
      setError(null);
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
        setError("Screen recording isn't supported in this browser.");
        return;
      }

      try {
        const constraints: DisplayMediaStreamOptions = {
          displaySurface: surface,
          video: {
            frameRate: { ideal: 60, max: 60 },
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          } as MediaTrackConstraints,
          audio: includeAudio
            ? { echoCancellation: false, noiseSuppression: false, sampleRate: 44100 }
            : false,
        };
        const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);

        const [videoTrack] = displayStream.getVideoTracks();
        const settings = videoTrack.getSettings();
        const width = settings.width ?? 0;
        const height = settings.height ?? 0;
        trackSettingsRef.current = { width, height };

        // Scale bitrate to resolution for high quality, capped at 50 Mbps.
        const pixels = (width || 1920) * (height || 1080);
        const bitrate = Math.min(Math.round(pixels * 0.18) + 8_000_000, 50_000_000);

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

        recorder.onstop = () => {
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

        function triggerDownload(blob: Blob) {
          const suggestedName = `screencapture-pro_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.webm`;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = suggestedName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }

        // User stops sharing via browser UI.
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
    [includeAudio, startTimer],
  );

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
  };
}
