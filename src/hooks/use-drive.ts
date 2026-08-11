import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { RecordingResult } from "@/hooks/use-screen-recorder";
import {
  getDriveAuthUrl,
  getDriveAccessToken,
  disconnectDrive,
  getAutoUploadEnabled,
  setAutoUploadEnabled,
  uploadRecordingToDrive,
} from "@/lib/drive";
import { buildFileName, sanitizeFileName } from "@/lib/recording-utils";
import {
  createRecordingEntry,
  deleteRecordingEntry,
  renameRecordingEntry,
  type RecordingHistoryEntry,
} from "@/lib/recording-history-api";

export function useDrive() {
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [driveEmail, setDriveEmail] = useState<string | null>(() =>
    sessionStorage.getItem("sc-drive-email"),
  );
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("sc-drive-token"),
  );
  const [autoUpload, setAutoUpload] = useState<boolean>(() => getAutoUploadEnabled());
  const [reloadKey, setReloadKey] = useState(0);

  const checkConnection = useCallback(async () => {
    console.info(`[use-drive] checkConnection: isAuthenticated=${isAuthenticated}`);
    if (!isAuthenticated) {
      setConnected(false);
      return;
    }
    try {
      const token = await getDriveAccessToken();
      sessionStorage.setItem("sc-drive-token", token);
      setAccessToken(token);
      setConnected(true);
      console.info("[use-drive] connection OK");
    } catch (err) {
      console.info(
        `[use-drive] connection check failed: ${err instanceof Error ? err.message : err}`,
      );
      setConnected(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const beginConnect = useCallback(() => {
    if (!isAuthenticated) return;
    window.location.assign(getDriveAuthUrl(window.location.origin));
  }, [isAuthenticated]);

  const saveToDrive = useCallback(
    async (result: RecordingResult): Promise<void> => {
      let token = accessToken;
      if (!token) {
        token = await getDriveAccessToken();
        sessionStorage.setItem("sc-drive-token", token);
        setAccessToken(token);
      }
      const stamp = result.createdAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const ext = result.mimeType.includes("mp4") ? ".mp4" : ".webm";
      const fileName = `ScreenFlow_${stamp}${ext}`;
      console.info(`[use-drive] saveToDrive: upload "${fileName}" (${result.sizeBytes} bytes)`);
      const { fileId, webViewLink } = await uploadRecordingToDrive(result.blob, token, fileName);
      console.info(`[use-drive] uploaded fileId=${fileId}`);
      await createRecordingEntry({
        driveFileId: fileId,
        driveUrl: webViewLink,
        durationSeconds: result.durationSeconds,
        width: result.width,
        height: result.height,
        sizeBytes: result.sizeBytes,
        mimeType: result.mimeType,
      });
      setAutoUploadEnabled(true);
      setAutoUpload(true);
      setReloadKey((k) => k + 1);
      console.info("[use-drive] recording entry created, auto-upload enabled");
    },
    [accessToken],
  );

  const deleteEntry = useCallback(async (id: number) => {
    console.info(`[use-drive] deleteEntry id=${id}`);
    await deleteRecordingEntry(id);
    setReloadKey((k) => k + 1);
  }, []);

  const disconnect = useCallback(async () => {
    console.info("[use-drive] disconnect");
    try {
      await disconnectDrive();
    } finally {
      setConnected(false);
      setAccessToken(null);
      setDriveEmail(null);
      setAutoUploadEnabled(false);
      setAutoUpload(false);
      sessionStorage.removeItem("sc-drive-token");
      sessionStorage.removeItem("sc-drive-email");
      setReloadKey((k) => k + 1);
    }
  }, []);

  return {
    connected,
    driveEmail,
    autoUpload,
    reloadKey,
    beginConnect,
    saveToDrive,
    deleteEntry,
    disconnect,
    reconnect: checkConnection,
  };
}
