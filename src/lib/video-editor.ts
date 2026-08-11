import { pickWebMimeType, type RecordingFormat } from "./recording-formats";

export interface VideoOptions {
  width: number;
  height: number;
  fps?: number;
  format?: RecordingFormat;
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

function getSupportedMimeType(format?: RecordingFormat): string {
  if (format) {
    const chosen = pickWebMimeType(format);
    if (chosen) return chosen;
  }
  const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "video/webm";
}

function loadVideo(blob: Blob, muted = true): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.muted = muted;
    video.playsInline = true;
    video.preload = "auto";
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error("Failed to load video"));
  });
}

interface VideoAudioTrack {
  ctx: AudioContext;
  track: MediaStreamTrack;
}

function createVideoAudioTrack(video: HTMLVideoElement): VideoAudioTrack | null {
  try {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();
    const src = ctx.createMediaElementSource(video);
    src.connect(dest);
    return { ctx, track: dest.stream.getAudioTracks()[0] };
  } catch (err) {
    console.warn("Source audio setup failed, continuing without source audio", err);
    return null;
  }
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function createRecorder(
  canvas: HTMLCanvasElement,
  fps: number,
  onDone: (blob: Blob) => void,
  onError: (err: unknown) => void,
  audioTracks: MediaStreamTrack[] = [],
  format?: RecordingFormat,
): MediaRecorder {
  const stream = canvas.captureStream(fps);
  for (const track of audioTracks) {
    stream.addTrack(track);
  }
  const mimeType = getSupportedMimeType(format);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    onDone(blob);
  };
  recorder.onerror = (e) => onError(e.error);
  recorder.start();

  return recorder;
}

async function processFrames(
  blob: Blob,
  outputWidth: number,
  outputHeight: number,
  fps: number,
  renderFrame: (
    video: HTMLVideoElement,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => boolean,
  format?: RecordingFormat,
): Promise<Blob> {
  const video = await loadVideo(blob, false);
  const audio = createVideoAudioTrack(video);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;

  return new Promise((resolve, reject) => {
    const recorder = createRecorder(
      canvas,
      fps,
      (result) => {
        URL.revokeObjectURL(video.src);
        if (audio) audio.ctx.close().catch(() => {});
        resolve(result);
      },
      (err) => {
        URL.revokeObjectURL(video.src);
        if (audio) audio.ctx.close().catch(() => {});
        reject(err);
      },
      audio ? [audio.track] : [],
      format,
    );

    let running = true;

    video.onerror = () => {
      running = false;
      if (recorder.state === "recording") recorder.stop();
      reject(new Error("Failed to decode video while processing"));
    };

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

    video
      .play()
      .then(() => {
        requestAnimationFrame(tick);
      })
      .catch((err) => {
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
  const video = await loadVideo(blob, false);
  const audio = createVideoAudioTrack(video);
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
    const recorder = createRecorder(
      canvas,
      fps,
      (result) => {
        URL.revokeObjectURL(video.src);
        if (audio) audio.ctx.close().catch(() => {});
        resolve(result);
      },
      (err) => {
        URL.revokeObjectURL(video.src);
        if (audio) audio.ctx.close().catch(() => {});
        reject(err);
      },
      audio ? [audio.track] : [],
    );

    video.onerror = () => {
      if (recorder.state === "recording") recorder.stop();
      reject(new Error("Failed to decode video while trimming"));
    };

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
      cropRect.x,
      cropRect.y,
      cropRect.width,
      cropRect.height,
      0,
      0,
      outputWidth,
      outputHeight,
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

export async function mergeClips(blobs: Blob[], options: VideoOptions): Promise<Blob> {
  if (blobs.length === 0) throw new Error("No clips to merge");
  if (blobs.length === 1) return blobs[0];

  const fps = options.fps ?? 30;
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;

  return new Promise((resolve, reject) => {
    const audioCtx = new AudioContext();
    const dest = audioCtx.createMediaStreamDestination();
    const canvasStream = canvas.captureStream(fps);
    canvasStream.addTrack(dest.stream.getAudioTracks()[0]);
    const mimeType = getSupportedMimeType();
    const recorder = new MediaRecorder(canvasStream, { mimeType });
    const chunks: Blob[] = [];
    const urls: string[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      audioCtx.close().catch(() => {});
      if (failed) {
        reject(new Error("A clip failed to load"));
      } else {
        resolve(new Blob(chunks, { type: "video/webm" }));
      }
    };
    recorder.onerror = (e) => reject(e.error);

    let failed = false;
    let currentVideo: HTMLVideoElement | null = null;
    let index = 0;

    const playNext = () => {
      if (index >= blobs.length) {
        if (recorder.state === "recording") recorder.stop();
        return;
      }
      const video = document.createElement("video");
      video.playsInline = true;
      currentVideo = video;
      try {
        const src = audioCtx.createMediaElementSource(video);
        src.connect(dest);
      } catch (err) {
        console.warn("Clip audio setup failed, continuing without clip audio", err);
      }
      const url = URL.createObjectURL(blobs[index]);
      urls.push(url);
      video.onloadedmetadata = () => {
        video.play().catch(() => {
          failed = true;
          if (recorder.state === "recording") recorder.stop();
        });
      };
      video.onerror = () => {
        failed = true;
        if (recorder.state === "recording") recorder.stop();
      };
      video.src = url;
      index++;
    };

    const tick = () => {
      if (recorder.state !== "recording") return;
      const video = currentVideo;
      if (video && !video.paused && !video.ended && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      if (video && video.ended) {
        playNext();
      }
      requestAnimationFrame(tick);
    };

    recorder.start();
    playNext();
    requestAnimationFrame(tick);
  });
}

export async function processWithEffects(
  blob: Blob,
  options: VideoOptions & ProcessEffectsOptions,
): Promise<Blob> {
  const video = await loadVideo(blob, false);
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;
  const fps = options.fps ?? 30;
  const speed = options.speed ?? 1;
  const captionList = options.captions ?? [];
  const hasMusic = !!options.music;

  return new Promise<Blob>((resolve, reject) => {
    run().catch(reject);

    async function run() {
      let audioCtx: AudioContext | null = null;
      let audioEl: HTMLAudioElement | null = null;
      let audioTrack: MediaStreamTrack | null = null;
      const cleanupUrls: string[] = [];
      let audioStarted = false;

      try {
        audioCtx = new AudioContext();
        const dest = audioCtx.createMediaStreamDestination();
        try {
          const src = audioCtx.createMediaElementSource(video);
          src.connect(dest);
        } catch (err) {
          console.warn("Source audio setup failed, continuing without source audio", err);
        }
        if (hasMusic && options.music) {
          try {
            audioEl = document.createElement("audio");
            const musicUrl = URL.createObjectURL(options.music.blob);
            cleanupUrls.push(musicUrl);
            audioEl.src = musicUrl;
            audioEl.loop = false;
            audioEl.volume = 1;
            const source = audioCtx.createMediaElementSource(audioEl);
            const gain = audioCtx.createGain();
            gain.gain.value = options.music.volume;
            source.connect(gain);
            gain.connect(dest);
          } catch (err) {
            console.warn("Music setup failed, continuing without music", err);
          }
        }
        audioTrack = dest.stream.getAudioTracks()[0];
      } catch (err) {
        console.warn("Audio setup failed, continuing without audio", err);
      }

      const videoStream = canvas.captureStream(fps);
      const tracks: MediaStreamTrack[] = videoStream.getVideoTracks();
      if (audioTrack) tracks.push(audioTrack);
      const combinedStream = new MediaStream(tracks);

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: Blob[] = [];

      const cleanup = () => {
        cleanupUrls.forEach((u) => URL.revokeObjectURL(u));
        URL.revokeObjectURL(video.src);
        if (audioCtx) audioCtx.close().catch(() => {});
      };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        cleanup();
        resolve(new Blob(chunks, { type: "video/webm" }));
      };
      recorder.onerror = (e) => {
        cleanup();
        reject(e.error);
      };

      // Position video at trim start
      if (options.trim) {
        video.currentTime = options.trim.start;
        await new Promise<void>((res) => {
          video.onseeked = () => res();
          video.onerror = () => res();
        });
      }

      video.onerror = () => {
        cleanup();
        if (recorder.state === "recording") recorder.stop();
        reject(new Error("Failed to decode video while applying effects"));
      };

      recorder.start();
      const endTime = options.trim?.end ?? video.duration;

      video.playbackRate = speed;
      try {
        await video.play();
      } catch (err) {
        cleanup();
        if (recorder.state === "recording") recorder.stop();
        throw err;
      }

      if (audioEl && audioTrack) {
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {});
        audioStarted = true;
      }

      const tick = () => {
        if (recorder.state === "inactive") return;
        if (video.currentTime >= endTime || video.ended) {
          video.pause();
          if (audioEl && audioStarted) {
            audioEl.pause();
          }
          if (recorder.state === "recording") recorder.stop();
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw captions
        const ct = video.currentTime;
        for (const cap of captionList) {
          if (ct >= cap.start && ct <= cap.end) {
            const fontSize = Math.max(14, Math.round(canvas.width * 0.035));
            ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
            const metrics = ctx.measureText(cap.text);
            const pad = Math.round(canvas.width * 0.02);
            const textX = canvas.width / 2;
            const textY = canvas.height * 0.88;
            const bw = metrics.width + pad * 2;
            const bh = fontSize * 1.6;
            const bx = textX - bw / 2;
            const by = textY - bh / 2;

            ctx.fillStyle = "rgba(0,0,0,0.65)";
            roundedRectPath(ctx, bx, by, bw, bh, Math.round(fontSize * 0.4));
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cap.text, textX, textY);
          }
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  });
}
