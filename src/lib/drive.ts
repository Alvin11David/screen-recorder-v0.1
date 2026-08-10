const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "sc-auth-token";
const DRIVE_SCOPE = "openid email profile https://www.googleapis.com/auth/drive.file";

console.info(`[drive] API_BASE = ${API_BASE}`);
const FOLDER_NAME = "ScreenFlow Recordings";
const FOLDER_KEY = "sc-drive-folder-id";
const AUTO_UPLOAD_KEY = "sc-drive-auto-upload";

export interface DriveConnection {
  driveEmail: string;
  accessToken: string;
  expiresIn: number;
}

export interface DriveUploadResult {
  fileId: string;
  webViewLink: string;
}

function authHeaders(json = true): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export function getDriveAuthUrl(origin: string): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Missing VITE_GOOGLE_CLIENT_ID environment variable. " +
        "Create a .env file with VITE_GOOGLE_CLIENT_ID=your_google_client_id",
    );
  }
  const redirectUri = `${origin}/auth/google/drive-callback`;
  const state = crypto.randomUUID();
  sessionStorage.setItem("google_drive_oauth_state", state);
  console.info(`[drive] build auth url: origin=${origin} clientIdSet=${Boolean(clientId)} redirect=${redirectUri}`);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: DRIVE_SCOPE,
    state,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function connectDrive(code: string, redirectUri: string): Promise<DriveConnection> {
  const res = await fetch(`${API_BASE}/api/drive/connect`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ code, redirectUri }),
  });
  console.info(`[drive] connect ${API_BASE}/api/drive/connect -> ${res.status}`);
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error((data.error as string) || "Failed to connect Google Drive");
  return data as unknown as DriveConnection;
}

export async function getDriveAccessToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/drive/access-token`, {
    method: "GET",
    headers: authHeaders(false),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error((data.error as string) || "Failed to get Drive access token");
  return data.accessToken as string;
}

export async function disconnectDrive(): Promise<void> {
  await fetch(`${API_BASE}/api/drive/connection`, {
    method: "DELETE",
    headers: authHeaders(false),
  });
}

export function getAutoUploadEnabled(): boolean {
  return localStorage.getItem(AUTO_UPLOAD_KEY) === "1";
}

export function setAutoUploadEnabled(enabled: boolean): void {
  if (enabled) localStorage.setItem(AUTO_UPLOAD_KEY, "1");
  else localStorage.removeItem(AUTO_UPLOAD_KEY);
}

async function ensureDriveFolder(accessToken: string): Promise<string> {
  const existing = localStorage.getItem(FOLDER_KEY);
  if (existing) return existing;

  const query = encodeURIComponent(
    `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
  );
  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (listRes.ok) {
    const list = (await listRes.json()) as { files?: { id: string; name: string }[] };
    const folder = list.files?.find((f) => f.name === FOLDER_NAME);
    if (folder) {
      localStorage.setItem(FOLDER_KEY, folder.id);
      return folder.id;
    }
  }

  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
  });
  const created = (await createRes.json()) as { id?: string; error?: { message?: string } };
  if (!createRes.ok || !created.id) {
    throw new Error(created.error?.message || "Failed to create Drive folder");
  }
  localStorage.setItem(FOLDER_KEY, created.id);
  return created.id;
}

export async function uploadRecordingToDrive(
  blob: Blob,
  accessToken: string,
  fileName: string,
): Promise<DriveUploadResult> {
  const folderId = await ensureDriveFolder(accessToken);
  const mimeType = blob.type || "video/webm";

  const initRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(blob.size),
      },
      body: JSON.stringify({ name: fileName, mimeType, parents: [folderId] }),
    },
  );
  if (!initRes.ok) {
    const err = (await initRes.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err.error?.message || "Failed to start Drive upload");
  }
  const sessionUri = initRes.headers.get("Location");
  if (!sessionUri) throw new Error("Drive upload session unavailable");

  const uploadRes = await fetch(sessionUri, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: blob,
  });
  if (uploadRes.status !== 200 && uploadRes.status !== 201) {
    const err = (await uploadRes.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err.error?.message || "Drive upload failed");
  }
  const file = (await uploadRes.json()) as { id?: string };
  if (!file.id) throw new Error("Drive upload failed");
  return {
    fileId: file.id,
    webViewLink: `https://drive.google.com/file/d/${file.id}/view`,
  };
}
