import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "countdown" | "crop" | "multi-setup" | "recording" | "paused";
export type CaptureSurface = "monitor" | "window" | "browser" | "multi-monitor";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type QualityPreset = {
  label: string;
  short: string;
  width: number;
  height: number;
};

export const QUALITY_PRESETS: QualityPreset[] = [
  { label: "720p HD", short: "720p", width: 1280, height: 720 },
  { label: "1080p Full HD", short: "1080p", width: 1920, height: 1080 },
  { label: "1440p QHD", short: "1440p", width: 2560, height: 1440 },
  { label: "4K Ultra HD", short: "4K", width: 3840, height: 2160 },
];

export interface CameraSettings {
  mirrored: boolean;
  borderColor: string;
  borderWidth: number;
  shadowBlur: number;
  radius: number;
}

export const DEFAULT_CAMERA_POSITION = { x: 85, y: 85 };

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
  const [includeCamera, setIncludeCamera] = useState(false);
  const [fps, setFps] = useState<30 | 60>(60);
  const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = useState(false);
  const [autoStopMinutes, setAutoStopMinutes] = useState(0); // 0 = disabled
  const fpsRef = useRef(fps);
  fpsRef.current = fps;
  const noiseRef = useRef(noiseSuppressionEnabled);
  noiseRef.current = noiseSuppressionEnabled;
  const autoStopRef = useRef(autoStopMinutes);
  autoStopRef.current = autoStopMinutes;
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPosition, setCameraPosition] = useState(DEFAULT_CAMERA_POSITION);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    mirrored: true,
    borderColor: "#ffffff",
    borderWidth: 3,
    shadowBlur: 20,
    radius: 70,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackSettingsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const pendingStreamRef = useRef<MediaStream | null>(null);
  const multiStreamsRef = useRef<MediaStream[]>([]);

  // Compositing refs (kept stable for the rAF loop)
  const camPosRef = useRef(cameraPosition);
  camPosRef.current = cameraPosition;
  const camSetRef = useRef(cameraSettings);
  camSetRef.current = cameraSettings;
  const compositeRunning = useRef(false);
  const compositePausedRef = useRef(false);
  const compositeScreenVideo = useRef<HTMLVideoElement | null>(null);
  const compositeCameraVideo = useRef<HTMLVideoElement | null>(null);
  const compositeCanvas = useRef<HTMLCanvasElement | null>(null);
  const compositeAudioCtx = useRef<AudioContext | null>(null);

  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [multiStreams, setMultiStreams] = useState<MediaStream[]>([]);

  const annotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const annotationCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [annotationsEnabled, setAnnotationsEnabled] = useState(false);
  const annotationsEnabledRef = useRef(false);
  annotationsEnabledRef.current = annotationsEnabled;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecordingRef = useRef<(() => void) | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    clearTimer();
    timerRef.current = setInterval(() => {
      const current = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
      setElapsed(current);
      // Auto-stop if configured
      if (autoStopRef.current > 0 && current >= autoStopRef.current * 60) {
        stopRecordingRef.current?.();
      }
    }, 250);
  }, []);

  const stopComposite = useCallback(() => {
    compositeRunning.current = false;
    compositePausedRef.current = false;
    compositeScreenVideo.current?.pause();
    compositeScreenVideo.current = null;
    compositeCameraVideo.current?.pause();
    compositeCameraVideo.current = null;
    compositeCanvas.current = null;
    if (compositeAudioCtx.current) {
      compositeAudioCtx.current.close();
      compositeAudioCtx.current = null;
    }
  }, []);

  const setupAnnotationCanvas = useCallback((width: number, height: number) => {
    let canvas = annotationCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      annotationCanvasRef.current = canvas;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    annotationCtxRef.current = ctx;
  }, []);

  const clearAnnotationCanvas = useCallback(() => {
    const ctx = annotationCtxRef.current;
    if (!ctx) return;
    const canvas = annotationCanvasRef.current;
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const overlayAnnotations = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const ac = annotationCanvasRef.current;
    if (!ac || !annotationsEnabledRef.current) return;
    ctx.drawImage(ac, 0, 0, w, h);
  }, []);

  const createThrottledFrameLoop = useCallback((
    fps: number,
    drawFn: () => void,
    runningRef: React.MutableRefObject<boolean>,
    pausedRef: React.MutableRefObject<boolean>
  ) => {
    const frameInterval = 1000 / fps;
    let lastFrameTime = 0;

    const frame = (timestamp: number) => {
      if (!runningRef.current) return;
      if (!pausedRef.current) {
        const elapsed = timestamp - lastFrameTime;
        if (elapsed >= frameInterval) {
          lastFrameTime = timestamp - (elapsed % frameInterval);
          drawFn();
        }
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, []);

  // Request / release camera when toggled
  useEffect(() => {
    if (!includeCamera) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
        setCameraStream(null);
      }
      return;
    }
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((cs) => {
        if (!cancelled) setCameraStream(cs);
        else cs.getTracks().forEach((t) => t.stop());
      })
      .catch(() => {
        setIncludeCamera(false);
        setError("Camera access denied. Please allow camera permissions.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeCamera]);

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
            frameRate: { ideal: fpsRef.current, max: fpsRef.current },
            width: { ideal: quality.width },
            height: { ideal: quality.height },
          } as MediaTrackConstraints,
          audio: includeAudio
            ? { echoCancellation: noiseRef.current, noiseSuppression: noiseRef.current, sampleRate: 44100 }
            : false,
        };
        const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);

        const [videoTrack] = displayStream.getVideoTracks();
        const settings = videoTrack.getSettings();
        const width = settings.width ?? quality.width;
        const height = settings.height ?? quality.height;
        trackSettingsRef.current = { width, height };

        if (annotationsEnabledRef.current) setupAnnotationCanvas(width, height);

        // ── Crop mode for entire-screen capture ───────────────────────
        if (surface === "monitor") {
          pendingStreamRef.current = displayStream;
          setStream(displayStream);
          setStatus("crop");
          return;
        }

        // ── Multi-monitor setup ────────────────────────────────────────
        if (surface === "multi-monitor") {
          multiStreamsRef.current = [displayStream];
          setMultiStreams([displayStream]);
          setStream(displayStream);
          setStatus("multi-setup");
          return;
        }

        const pixels = width * height;
        const bitrate = Math.min(Math.max(Math.round(pixels * 7), 5_000_000), 50_000_000);

        const mimeType = pickMimeType();
        let recordingStream: MediaStream;

        // ── Camera compositing ──────────────────────────────────────────
        if (includeCamera && cameraStream) {
          const screenVideo = document.createElement("video");
          screenVideo.srcObject = displayStream;
          screenVideo.muted = true;
          screenVideo.playsInline = true;
          await screenVideo.play();

          const camVideo = document.createElement("video");
          camVideo.srcObject = cameraStream;
          camVideo.muted = true;
          camVideo.playsInline = true;
          await camVideo.play();

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;

          compositeScreenVideo.current = screenVideo;
          compositeCameraVideo.current = camVideo;
          compositeCanvas.current = canvas;
          compositeRunning.current = true;

          const frameInterval = 1000 / fpsRef.current;
          let lastFrameTime = 0;
          const frame = (timestamp: number) => {
            if (!compositeRunning.current) return;
            const elapsed = timestamp - lastFrameTime;
            if (elapsed >= frameInterval) {
              lastFrameTime = timestamp - (elapsed % frameInterval);
              if (!compositePausedRef.current) {
                ctx.clearRect(0, 0, width, height);

                // Screen layer
                ctx.drawImage(screenVideo, 0, 0, width, height);

                // Camera PIP layer
                const pos = camPosRef.current;
                const set = camSetRef.current;
                const cx = (pos.x / 100) * width;
                const cy = (pos.y / 100) * height;
                const r = set.radius;

                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.clip();

                const src = camVideo;
                const sw = r * 2;
                const sh = r * 2;

                if (set.mirrored) {
                  ctx.save();
                  ctx.translate(cx, 0);
                  ctx.scale(-1, 1);
                  ctx.drawImage(src, -(cx - r), cy - r, sw, sh);
                  ctx.restore();
                } else {
                  ctx.drawImage(src, cx - r, cy - r, sw, sh);
                }
                ctx.restore();

                // Border ring
                ctx.save();
                ctx.shadowColor = "rgba(255,255,255,0.25)";
                ctx.shadowBlur = set.shadowBlur;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = set.borderColor;
                ctx.lineWidth = set.borderWidth;
                ctx.stroke();
                ctx.restore();

                overlayAnnotations(ctx, width, height);
              }
            }
            requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);

          const canvasStream = canvas.captureStream(fpsRef.current);

          // Mix audio
          const audioCtx = new AudioContext();
          if (audioCtx.state === "suspended") audioCtx.resume();
          compositeAudioCtx.current = audioCtx;
          const dest = audioCtx.createMediaStreamDestination();

          if (includeAudio && displayStream.getAudioTracks().length > 0) {
            const srcNode = audioCtx.createMediaStreamSource(displayStream);
            srcNode.connect(dest);
          }
          if (cameraStream.getAudioTracks().length > 0) {
            const srcNode = audioCtx.createMediaStreamSource(cameraStream);
            srcNode.connect(dest);
          }

          recordingStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);

          // Show composited preview
          setStream(recordingStream);
        } else if (annotationsEnabledRef.current) {
          const screenVideo = document.createElement("video");
          screenVideo.srcObject = displayStream;
          screenVideo.muted = true;
          screenVideo.playsInline = true;
          await screenVideo.play();

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;

          compositeScreenVideo.current = screenVideo;
          compositeCanvas.current = canvas;
          compositeRunning.current = true;

          const frameInterval = 1000 / fpsRef.current;
          let lastFrameTime = 0;
          const frame = (timestamp: number) => {
            if (!compositeRunning.current) return;
            const elapsed = timestamp - lastFrameTime;
            if (elapsed >= frameInterval) {
              lastFrameTime = timestamp - (elapsed % frameInterval);
              if (!compositePausedRef.current) {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(screenVideo, 0, 0, width, height);
                overlayAnnotations(ctx, width, height);
              }
            }
            requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);

          const canvasStream = canvas.captureStream(fpsRef.current);

          const audioCtx = new AudioContext();
          if (audioCtx.state === "suspended") audioCtx.resume();
          compositeAudioCtx.current = audioCtx;
          const dest = audioCtx.createMediaStreamDestination();
          if (includeAudio && displayStream.getAudioTracks().length > 0) {
            const srcNode = audioCtx.createMediaStreamSource(displayStream);
            srcNode.connect(dest);
          }

          recordingStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);
          setStream(recordingStream);
        } else {
          recordingStream = displayStream;
          setStream(displayStream);
        }

        // ── MediaRecorder ───────────────────────────────────────────────
        const recorder = new MediaRecorder(recordingStream, {
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
          stopComposite();
        };

        recorder.onstop = handleStop;

        // User stops sharing via browser UI
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
    [includeAudio, quality, includeCamera, cameraStream, startTimer, stopComposite],
  );

  const confirmCrop = useCallback(
    async (rect: CropRect) => {
      const displayStream = pendingStreamRef.current;
      if (!displayStream) return;

      setCropRect(rect);
      setStatus("idle");

      if (annotationsEnabledRef.current) setupAnnotationCanvas(rect.width, rect.height);

      const [videoTrack] = displayStream.getVideoTracks();
      const settings = videoTrack.getSettings();
      trackSettingsRef.current = { width: rect.width, height: rect.height };

      const mimeType = pickMimeType();
      const pixels = rect.width * rect.height;
      const bitrate = Math.min(Math.max(Math.round(pixels * 7), 5_000_000), 50_000_000);

      const screenVideo = document.createElement("video");
      screenVideo.srcObject = displayStream;
      screenVideo.muted = true;
      screenVideo.playsInline = true;
      await screenVideo.play();

      const canvas = document.createElement("canvas");
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext("2d")!;

      compositeScreenVideo.current = screenVideo;
      compositeCanvas.current = canvas;
      compositeRunning.current = true;

      let recordingStream: MediaStream;

      if (includeCamera && cameraStream) {
        const camVideo = document.createElement("video");
        camVideo.srcObject = cameraStream;
        camVideo.muted = true;
        camVideo.playsInline = true;
        await camVideo.play();
        compositeCameraVideo.current = camVideo;

        const frame = () => {
          if (!compositeRunning.current) return;
          if (!compositePausedRef.current) {
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(
              screenVideo,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              0,
              0,
              rect.width,
              rect.height,
            );

            const pos = camPosRef.current;
            const set = camSetRef.current;
            const cx = (pos.x / 100) * rect.width;
            const cy = (pos.y / 100) * rect.height;
            const r = set.radius;

            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.clip();
            if (set.mirrored) {
              ctx.save();
              ctx.translate(cx, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(camVideo, -(cx - r), cy - r, r * 2, r * 2);
              ctx.restore();
            } else {
              ctx.drawImage(camVideo, cx - r, cy - r, r * 2, r * 2);
            }
            ctx.restore();

            ctx.save();
            ctx.shadowColor = "rgba(255,255,255,0.25)";
            ctx.shadowBlur = set.shadowBlur;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = set.borderColor;
            ctx.lineWidth = set.borderWidth;
            ctx.stroke();
            ctx.restore();

            overlayAnnotations(ctx, rect.width, rect.height);
          }
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);

        const canvasStream = canvas.captureStream(fpsRef.current);

        const audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") audioCtx.resume();
        compositeAudioCtx.current = audioCtx;
        const dest = audioCtx.createMediaStreamDestination();
        if (includeAudio && displayStream.getAudioTracks().length > 0) {
          const srcNode = audioCtx.createMediaStreamSource(displayStream);
          srcNode.connect(dest);
        }
        if (cameraStream.getAudioTracks().length > 0) {
          const srcNode = audioCtx.createMediaStreamSource(cameraStream);
          srcNode.connect(dest);
        }

        recordingStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ]);
      } else {
        const frame = () => {
          if (!compositeRunning.current) return;
          if (!compositePausedRef.current) {
            ctx.drawImage(
              screenVideo,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              0,
              0,
              rect.width,
              rect.height,
            );
            overlayAnnotations(ctx, rect.width, rect.height);
          }
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);

        const canvasStream = canvas.captureStream(fpsRef.current);

        const audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") audioCtx.resume();
        compositeAudioCtx.current = audioCtx;
        const dest = audioCtx.createMediaStreamDestination();
        if (includeAudio && displayStream.getAudioTracks().length > 0) {
          const srcNode = audioCtx.createMediaStreamSource(displayStream);
          srcNode.connect(dest);
        }

        recordingStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ]);
      }

      setStream(recordingStream);

      const recorder = new MediaRecorder(recordingStream, {
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
        stopComposite();
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
      setStatus("recording");
      startTimer();
    },
    [includeAudio, includeCamera, cameraStream, startTimer, stopComposite],
  );

  const cancelCrop = useCallback(() => {
    const stream = pendingStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    pendingStreamRef.current = null;
    setStream(null);
    setCropRect(null);
    setStatus("idle");
  }, []);

  const addMonitorStream = useCallback(async () => {
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: fpsRef.current, max: fpsRef.current } },
        audio: includeAudio
          ? { echoCancellation: noiseRef.current, noiseSuppression: noiseRef.current, sampleRate: 44100 }
          : false,
      } as DisplayMediaStreamOptions);
      const updated = [...multiStreamsRef.current, newStream];
      multiStreamsRef.current = updated;
      setMultiStreams(updated);
    } catch {
      // user dismissed the picker — do nothing
    }
  }, [includeAudio]);

  const startMultiRecording = useCallback(async () => {
    const streams = multiStreamsRef.current;
    if (streams.length === 0) return;

    setStatus("idle");

    // Determine layout
    const n = streams.length;
    const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);

    // Pick the largest resolution for the canvas
    const settings = streams.map((s) => {
      const t = s.getVideoTracks()[0];
      const ts = t.getSettings();
      return { w: ts.width ?? 1920, h: ts.height ?? 1080, track: t };
    });
    const cellW = Math.max(...settings.map((s) => s.w), 1920);
    const cellH = Math.max(...settings.map((s) => s.h), 1080);

    const canvasW = cellW * cols;
    const canvasH = cellH * rows;
    trackSettingsRef.current = { width: canvasW, height: canvasH };

    if (annotationsEnabledRef.current) setupAnnotationCanvas(canvasW, canvasH);

    const mimeType = pickMimeType();
    const bitrate = Math.min(Math.max(Math.round(canvasW * canvasH * 7), 5_000_000), 50_000_000);

    // Create video elements for each stream
    const videos = await Promise.all(
      streams.map(async (s) => {
        const v = document.createElement("video");
        v.srcObject = s;
        v.muted = true;
        v.playsInline = true;
        await v.play();
        return v;
      }),
    );

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    compositeCanvas.current = canvas;
    compositeRunning.current = true;

    const frame = () => {
      if (!compositeRunning.current) return;
      if (!compositePausedRef.current) {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasW, canvasH);
        for (let i = 0; i < videos.length; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          ctx.drawImage(
            videos[i],
            0,
            0,
            settings[i].w,
            settings[i].h,
            col * cellW,
            row * cellH,
            cellW,
            cellH,
          );
        }
        overlayAnnotations(ctx, canvasW, canvasH);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    const canvasStream = canvas.captureStream(fpsRef.current);

    // Mix audio from all streams
    const audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();
    compositeAudioCtx.current = audioCtx;
    const dest = audioCtx.createMediaStreamDestination();
    if (includeAudio) {
      for (const s of streams) {
        if (s.getAudioTracks().length > 0) {
          const srcNode = audioCtx.createMediaStreamSource(s);
          srcNode.connect(dest);
        }
      }
    }
    const recordingStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    setStream(recordingStream);
    setMultiStreams([]);
    multiStreamsRef.current = [];
    pendingStreamRef.current = null;

    // ── MediaRecorder ──
    const recorder = new MediaRecorder(recordingStream, {
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
      for (const s of streams) s.getTracks().forEach((t) => t.stop());
      for (const v of videos) v.pause();
      setStream(null);
      setStatus("idle");
      clearTimer();
      stopComposite();
    };

    recorder.onstop = handleStop;

    for (const t of streams.map((s) => s.getVideoTracks()[0])) {
      if (!t) continue;
      t.addEventListener("ended", () => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
          recorderRef.current.stop();
        }
      });
    }

    recorderRef.current = recorder;
    accumulatedRef.current = 0;
    setElapsed(0);
    setResult(null);
    recorder.start(1000);
    setStatus("recording");
    startTimer();
  }, [includeAudio, startTimer, stopComposite]);

  const cancelMultiSetup = useCallback(() => {
    for (const s of multiStreamsRef.current) s.getTracks().forEach((t) => t.stop());
    multiStreamsRef.current = [];
    setMultiStreams([]);
    setStream(null);
    setStatus("idle");
  }, []);

  const startRecording = useCallback(
    (surface: CaptureSurface = "monitor") => {
      setError(null);
      let cd = 3;
      setCountdown(cd);
      setStatus("countdown");
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        cd -= 1;
        setCountdown(cd);
        if (cd <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          beginCapture(surface);
        }
      }, 1000);
    },
    [beginCapture],
  );

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
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
      compositePausedRef.current = true;
      compositeScreenVideo.current?.pause();
      compositeCameraVideo.current?.pause();
      compositeAudioCtx.current?.suspend();
      setStatus("paused");
    }
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      compositePausedRef.current = false;
      compositeScreenVideo.current?.play().catch(() => {});
      compositeCameraVideo.current?.play().catch(() => {});
      compositeAudioCtx.current?.resume();
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
    setCropRect(null);
    accumulatedRef.current = 0;
    clearAnnotationCanvas();
  }, [result, clearAnnotationCanvas]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      clearTimer();
      recorderRef.current?.state !== "inactive" && recorderRef.current?.stop();
      stream?.getTracks().forEach((t) => t.stop());
      cameraStream?.getTracks().forEach((t) => t.stop());
      pendingStreamRef.current?.getTracks().forEach((t) => t.stop());
      for (const s of multiStreamsRef.current) s.getTracks().forEach((t) => t.stop());
      stopComposite();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep stopRecordingRef in sync so auto-stop timer can call it
  stopRecordingRef.current = stopRecording;

  return {
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
    quality,
    setQuality,
    fps,
    setFps,
    noiseSuppressionEnabled,
    setNoiseSuppressionEnabled,
    autoStopMinutes,
    setAutoStopMinutes,
    includeCamera,
    setIncludeCamera,
    cameraStream,
    cameraPosition,
    setCameraPosition,
    cameraSettings,
    setCameraSettings,
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
