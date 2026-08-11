export const formatTimer = (totalSeconds: number): string => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

export const formatResolution = (width: number, height: number): string => {
  if (!width || !height) return "Unknown";
  let label = "";
  if (height >= 2160) label = " · 4K";
  else if (height >= 1080) label = " · Full HD";
  else if (height >= 720) label = " · HD";
  return `${width} × ${height}${label}`;
};

const pad = (n: number) => n.toString().padStart(2, "0");

export const defaultRecordingName = (date: Date): string => {
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(
    date.getHours(),
  )}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
  return `screencapture-pro_${stamp}`;
};

export const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\.(webm|mp4)$/i, "")
    .trim();
};

export const buildFileName = (name: string, mimeType: string, date: Date): string => {
  const base = sanitizeFileName(name) || defaultRecordingName(date);
  const ext = mimeType.includes("mp4") ? ".mp4" : ".webm";
  return `${base}${ext}`;
};

export const saveRecording = async (
  blob: Blob,
  createdAt: Date,
  fileName?: string,
): Promise<"saved" | "downloaded" | "cancelled"> => {
  const suggestedName = buildFileName(
    fileName ?? defaultRecordingName(createdAt),
    blob.type,
    createdAt,
  );

  // Prefer File System Access API where available.
  const picker = window.showSaveFilePicker;
  if (typeof picker === "function") {
    try {
      const handle = await picker({
        suggestedName,
        types: [
          {
            description: "WebM Video",
            accept: { "video/webm": [".webm"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "saved";
    } catch (err) {
      if ((err as DOMException).name === "AbortError") return "cancelled";
      // fall through to download fallback
    }
  }

  // Fallback: trigger a download.
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
};
