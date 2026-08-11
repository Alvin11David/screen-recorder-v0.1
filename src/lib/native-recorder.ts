import { Capacitor, registerPlugin } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface NativeScreenRecorderStartOptions {
  recordAudio: boolean;
}

export interface NativeScreenRecording {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  durationMs: number;
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
  await ScreenRecorder.start({ recordAudio: options.recordAudio });
}

export async function stopNativeScreenRecording(): Promise<NativeScreenRecording> {
  const res = await ScreenRecorder.stop();
  const read = await Filesystem.readFile({ path: res.path, directory: Directory.Cache });
  const data = typeof read.data === "string" ? read.data : "";
  const bytes = base64ToBytes(data);
  const mimeType = res.mimeType || "video/mp4";
  const buffer = new ArrayBuffer(bytes.length);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: mimeType });
  Filesystem.deleteFile({ path: res.path, directory: Directory.Cache }).catch(() => {});
  return {
    blob,
    mimeType,
    width: res.width,
    height: res.height,
    durationMs: res.durationMs,
  };
}

export async function cancelNativeScreenRecording(): Promise<void> {
  if (!nativeScreenRecordingAvailable()) return;
  try {
    await ScreenRecorder.cancel();
  } catch {
    // ignore cleanup errors
  }
}
