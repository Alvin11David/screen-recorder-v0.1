export type RecordingFormat = "mp4" | "webm" | "mpegts";

export interface RecordingFormatInfo {
  id: RecordingFormat;
  label: string;
  short: string;
  extension: string;
  mimeType: string;
  description: string;
  webMimeTypes: string[];
  nativeOutputFormat?: "mpeg4" | "webm" | "mpegts";
}

export const RECORDING_FORMATS: Record<RecordingFormat, RecordingFormatInfo> = {
  mp4: {
    id: "mp4",
    label: "MP4",
    short: "MP4",
    extension: ".mp4",
    mimeType: "video/mp4",
    description: "MP4 · best compatibility",
    webMimeTypes: [
      // Chrome's MediaRecorder MP4 muxer is broken for H.264 (avc1) — it
      // produces files whose playback freezes/glitches (crbug 362873381,
      // 370040409). VP9 in MP4 is verified-stable, so web MP4 uses VP9.
      // Native Android still records real H.264 via its own encoder.
      "video/mp4;codecs=vp9,opus",
      "video/mp4;codecs=vp9",
      "video/mp4",
    ],
    nativeOutputFormat: "mpeg4",
  },
  webm: {
    id: "webm",
    label: "WebM",
    short: "WebM",
    extension: ".webm",
    mimeType: "video/webm",
    description: "VP9 · smaller files",
    webMimeTypes: [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp8",
      "video/webm",
    ],
    nativeOutputFormat: "webm",
  },
  mpegts: {
    id: "mpegts",
    label: "MPEG-TS",
    short: "TS",
    extension: ".ts",
    mimeType: "video/mp2t",
    description: "MPEG transport stream",
    webMimeTypes: [],
    nativeOutputFormat: "mpegts",
  },
};

export const FORMAT_ORDER: RecordingFormat[] = ["mp4", "webm", "mpegts"];

function webFormatSupported(info: RecordingFormatInfo): boolean {
  if (typeof MediaRecorder === "undefined") return info.webMimeTypes.length > 0;
  return info.webMimeTypes.some((type) => MediaRecorder.isTypeSupported(type));
}

export function getAvailableFormats(isNative: boolean): RecordingFormatInfo[] {
  const available = FORMAT_ORDER.map((id) => RECORDING_FORMATS[id]).filter(
    (info) => isNative || (info.nativeOutputFormat !== "mpegts" && webFormatSupported(info)),
  );
  if (available.length === 0) return [RECORDING_FORMATS.webm];
  return available;
}

export function pickWebMimeType(format: RecordingFormat): string | null {
  const info = RECORDING_FORMATS[format];
  if (info) {
    for (const type of info.webMimeTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
  }
  return null;
}

export function defaultRecordingFormat(isNative: boolean): RecordingFormat {
  const available = getAvailableFormats(isNative);
  return available.some((f) => f.id === "mp4") ? "mp4" : available[0].id;
}
