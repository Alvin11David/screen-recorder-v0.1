const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "sc-auth-token";

export interface RecordingHistoryEntry {
  id: number;
  driveFileId: string;
  driveUrl: string;
  durationSeconds: number;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface CreateRecordingInput {
  driveFileId: string;
  driveUrl: string;
  durationSeconds: number;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
}

export class HistoryApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function headers(json = true): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

async function handle(res: Response): Promise<Record<string, unknown>> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new HistoryApiError((data.error as string) || "Request failed", res.status);
  return data;
}

export async function fetchRecordingHistory(): Promise<RecordingHistoryEntry[]> {
  const res = await fetch(`${API_BASE}/api/recordings`, { headers: headers(false) });
  const data = await handle(res);
  return data as unknown as RecordingHistoryEntry[];
}

export async function createRecordingEntry(input: CreateRecordingInput): Promise<RecordingHistoryEntry> {
  const res = await fetch(`${API_BASE}/api/recordings`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(input),
  });
  return (await handle(res)) as unknown as RecordingHistoryEntry;
}

export async function deleteRecordingEntry(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/recordings/${id}`, {
    method: "DELETE",
    headers: headers(false),
  });
  await handle(res);
}
