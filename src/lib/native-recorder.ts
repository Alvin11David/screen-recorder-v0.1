import { Capacitor, registerPlugin } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import type { RecordingFormat } from "./recording-formats";

export const PREVIEW_FRAME_EVENT = "screenflow:previewFrame";
export const PREVIEW_STOPPED_EVENT = "screenflow:previewStopped";

export interface NativePreviewFrame {
  data: string;
}

export interface NativePreviewSubscription {
  remove: () => void;
}

interface ScreenRecorderPlugin {
  start(options: NativeScreenRecorderStartOptions): Promise<void>;
  stop(): Promise<{
    path: string;
    mimeType: string;
    width: number;
    height: number;
    durationMs: number;
  }>;
  cancel(): Promise<void>;
  isRecording(): Promise<{ recording: boolean }>;
  addListener(
    eventName: string,
    listenerFunc: (data: NativePreviewFrame) => void,
  ): Promise<PluginListenerHandle>;
}

/**
 * Subscribes to live preview frames streamed by the native Android
 * ScreenRecorder service. `onFrame` receives a `data:image/jpeg;base64,...`
 * data URL for each frame. Returns a handle that can be used to unsubscribe.
 */
export async function subscribeNativePreview(
  onFrame: (dataUrl: string) => void,
  onStopped?: () => void,
): Promise<NativePreviewSubscription> {
  if (!nativeScreenRecordingAvailable()) return { remove: () => {} };
  const frameHandle = await ScreenRecorder.addListener(PREVIEW_FRAME_EVENT, (e) => {
    if (e?.data) onFrame(`data:image/jpeg;base64,${e.data}`);
  });
  const stoppedHandle = onStopped
    ? await ScreenRecorder.addListener(PREVIEW_STOPPED_EVENT, () => onStopped())
    : null;
  return {
    remove: () => {
      frameHandle.remove();
      stoppedHandle?.remove();
    },
  };
}

export interface NativeScreenRecorderStartOptions {
  recordAudio: boolean;
  format: RecordingFormat;
}

export interface NativeScreenRecording {
  url: string;
  filePath: string;
  mimeType: string;
  width: number;
  height: number;
  durationMs: number;
  sizeBytes: number;
}

interface ScreenRecorderPlugin {
  start(options: NativeScreenRecorderStartOptions): Promise<void>;
  stop(): Promise<{
    path: string;
    mimeType: string;
    width: number;
    height: number;
    durationMs: number;
  }>;
  cancel(): Promise<void>;
  isRecording(): Promise<{ recording: boolean }>;
}

const ScreenRecorder = registerPlugin<ScreenRecorderPlugin>("ScreenRecorder");

export function nativeScreenRecordingAvailable(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function startNativeScreenRecording(
  options: NativeScreenRecorderStartOptions,
): Promise<void> {
  if (!nativeScreenRecordingAvailable()) {
    throw new Error("Native screen recording is not available in this environment.");
  }
  await ScreenRecorder.start({ recordAudio: options.recordAudio, format: options.format });
}

export async function stopNativeScreenRecording(): Promise<NativeScreenRecording> {
  const res = await ScreenRecorder.stop();
  const readUri = await Filesystem.getUri({ path: res.path, directory: Directory.Cache });
  const stat = await Filesystem.stat({ path: res.path, directory: Directory.Cache });
  return {
    url: Capacitor.convertFileSrc(readUri.uri),
    filePath: res.path,
    mimeType: res.mimeType || "video/mp4",
    width: res.width,
    height: res.height,
    durationMs: res.durationMs,
    sizeBytes: stat.size,
  };
}

export async function readNativeRecordingBlob(filePath: string, mimeType?: string): Promise<Blob> {
  const read = await Filesystem.readFile({ path: filePath, directory: Directory.Cache });
  const data = typeof read.data === "string" ? read.data : "";
  const bytes = base64ToBytes(data);
  const buffer = new ArrayBuffer(bytes.length);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: mimeType || "video/mp4" });
}

export async function deleteNativeRecording(filePath: string): Promise<void> {
  try {
    await Filesystem.deleteFile({ path: filePath, directory: Directory.Cache });
  } catch {
    // ignore cleanup errors
  }
}

export async function cancelNativeScreenRecording(): Promise<void> {
  if (!nativeScreenRecordingAvailable()) return;
  try {
    await ScreenRecorder.cancel();
  } catch {
    // ignore cleanup errors
  }
}
