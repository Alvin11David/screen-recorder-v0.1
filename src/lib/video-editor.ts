export interface VideoOptions {
  width: number;
  height: number;
  fps?: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptionEntry {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface ProcessEffectsOptions {
  trim?: { start: number; end: number };
  speed?: number;
  captions?: CaptionEntry[];
  music?: {
    blob: Blob;
    volume: number;
  };
}

function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "video/webm";
}

function loadVideo(blob: Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error("Failed to load video"));
  });
}

function createRecorder(
  canvas: HTMLCanvasElement,
  fps: number,
  onDone: (blob: Blob) => void,
  onError: (err: unknown) => void,
): MediaRecorder {
  const stream = canvas.captureStream(fps);
  const mimeType = getSupportedMimeType();
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    onDone(blob);
  };
  recorder.onerror = () => onError(recorder.error);
  recorder.start();

  return recorder;
}

async function processFrames(
  blob: Blob,
  outputWidth: number,
  outputHeight: number,
  fps: number,
  renderFrame: (video: HTMLVideoElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => boolean,
): Promise<Blob> {
  const video = await loadVideo(blob);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;

  return new Promise((resolve, reject) => {
    const recorder = createRecorder(canvas, fps, (result) => {
      URL.revokeObjectURL(video.src);
      resolve(result);
    }, (err) => {
      URL.revokeObjectURL(video.src);
      reject(err);
    });

    let running = true;

    const tick = () => {
      if (!running) return;
      const shouldContinue = renderFrame(video, ctx, canvas);
      if (!shouldContinue) {
        running = false;
        if (recorder.state === "recording") recorder.stop();
        return;
      }
      requestAnimationFrame(tick);
    };

    video.play().then(() => {
      requestAnimationFrame(tick);
    }).catch((err) => {
      running = false;
      if (recorder.state === "recording") recorder.stop();
      reject(err);
    });
  });
}

export async function trimVideo(
  blob: Blob,
  startSec: number,
  endSec: number,
  options: VideoOptions,
): Promise<Blob> {
  const video = await loadVideo(blob);
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;
  const fps = options.fps ?? 30;

  video.currentTime = startSec;
  await new Promise<void>((resolve) => {
    video.onseeked = () => resolve();
    video.onerror = () => resolve();
  });

  return new Promise((resolve, reject) => {
    const recorder = createRecorder(canvas, fps, (result) => {
      URL.revokeObjectURL(video.src);
      resolve(result);
    }, (err) => {
      URL.revokeObjectURL(video.src);
      reject(err);
    });

    video.play();

    const tick = () => {
      if (video.currentTime >= endSec || video.ended) {
        video.pause();
        if (recorder.state === "recording") recorder.stop();
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export async function cropVideo(
  blob: Blob,
  cropRect: CropRect,
  outputWidth: number,
  outputHeight: number,
  options: VideoOptions,
): Promise<Blob> {
  const fps = options.fps ?? 30;
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;

  return processFrames(blob, outputWidth, outputHeight, fps, (video, _ctx, _canvas) => {
    if (video.ended) return false;
    ctx.drawImage(
      video,
      cropRect.x, cropRect.y, cropRect.width, cropRect.height,
      0, 0, outputWidth, outputHeight,
    );
    return true;
  });
}

export async function resizeVideo(
  blob: Blob,
  outputWidth: number,
  outputHeight: number,
  options: VideoOptions,
): Promise<Blob> {
  const fps = options.fps ?? 30;
  return processFrames(blob, outputWidth, outputHeight, fps, (video, _ctx, _canvas) => {
    if (video.ended) return false;
    _ctx.drawImage(video, 0, 0, outputWidth, outputHeight);
    return true;
  });
}

export async function mergeClips(
  blobs: Blob[],
  options: VideoOptions,
): Promise<Blob> {
  if (blobs.length === 0) throw new Error("No clips to merge");
  if (blobs.length === 1) return blobs[0];

  const fps = options.fps ?? 30;
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;

  return new Promise((resolve, reject) => {
    const recorder = createRecorder(canvas, fps, resolve, reject);
    let index = 0;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const urls: string[] = [];

    const playNext = () => {
      if (index >= blobs.length) {
        if (recorder.state === "recording") recorder.stop();
        urls.forEach((u) => URL.revokeObjectURL(u));
        return;
      }
      const url = URL.createObjectURL(blobs[index]);
      urls.push(url);
      video.src = url;
      video.onloadedmetadata = () => video.play();
      index++;
    };

    const tick = () => {
      if (recorder.state !== "recording") return;
      if (!video.paused && !video.ended && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      if (video.ended) {
        playNext();
      }
      requestAnimationFrame(tick);
    };

    playNext();
    requestAnimationFrame(tick);
  });
}
