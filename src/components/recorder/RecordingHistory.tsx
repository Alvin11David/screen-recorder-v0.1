import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Trash2,
  X,
  Clock,
  HardDrive,
  Monitor,
  Calendar,
  Cloud,
  ExternalLink,
  LogIn,
  Loader2,
  Pencil,
  Check,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { formatTimer, formatBytes, formatResolution } from "@/lib/recording-utils";
import type { RecordingResult } from "@/hooks/use-screen-recorder";
import {
  fetchRecordingHistory,
  type RecordingHistoryEntry as ApiRecordingHistoryEntry,
} from "@/lib/recording-history-api";

export interface HistoryEntry {
  id: string;
  durationSeconds: number;
  width: number;
  height: number;
  sizeBytes: number;
  createdAt: string; // ISO string
  mimeType: string;
  fileName?: string;
  driveUrl?: string;
  driveFileId?: string;
}

const STORAGE_KEY = "screencapture-history";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveToHistory(result: RecordingResult) {
  try {
    const entries = loadHistory();
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      durationSeconds: result.durationSeconds,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
      createdAt: result.createdAt.toISOString(),
      mimeType: result.mimeType,
      fileName: result.fileName,
    };
    entries.unshift(entry);
    // Keep max 50 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
  } catch {
    // localStorage quota exceeded, ignore
  }
}

export function updateHistoryEntryName(result: RecordingResult) {
  try {
    const entries = loadHistory();
    const match = entries.find((e) => e.createdAt === result.createdAt.toISOString());
    if (!match) return;
    match.fileName = result.fileName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage quota exceeded, ignore
  }
}

export interface DriveSync {
  connected: boolean | null;
  driveEmail: string | null;
  reloadKey: number;
  beginConnect: () => void;
  deleteEntry: (id: number) => Promise<void>;
  renameEntry?: (id: number, fileName: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

interface RecordingHistoryProps {
  open: boolean;
  onClose: () => void;
  drive?: DriveSync;
  isAuthenticated?: boolean;
}

const STATS = [
  {
    icon: Clock,
    key: "durationSeconds" as const,
    label: "Duration",
    fmt: (v: number) => formatTimer(v),
  },
  {
    icon: Monitor,
    key: "width" as const,
    label: "Resolution",
    fmt: (_: number, e: HistoryEntry) => formatResolution(e.width, e.height),
  },
  { icon: HardDrive, key: "sizeBytes" as const, label: "Size", fmt: (v: number) => formatBytes(v) },
];

function toLocalEntry(e: ApiRecordingHistoryEntry): HistoryEntry {
  return {
    id: String(e.id),
    durationSeconds: e.durationSeconds,
    width: e.width,
    height: e.height,
    sizeBytes: e.sizeBytes,
    createdAt: e.createdAt,
    mimeType: e.mimeType,
    fileName: e.fileName,
    driveUrl: e.driveUrl,
    driveFileId: e.driveFileId,
  };
}

export function RecordingHistory({
  open,
  onClose,
  drive,
  isAuthenticated = false,
}: RecordingHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const cloudActive = drive?.connected === true;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    if (cloudActive) {
      setLoading(true);
      console.info("[history] loading from API (cloud mode)");
      fetchRecordingHistory()
        .then((apiEntries) => {
          console.info(`[history] loaded ${apiEntries.length} entries from API`);
          if (!cancelled) setEntries(apiEntries.map(toLocalEntry));
        })
        .catch((err) => {
          console.info(`[history] API load FAILED: ${err instanceof Error ? err.message : err}`);
          if (!cancelled) setEntries([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      console.info(`[history] loading ${loadHistory().length} entries from localStorage`);
      setEntries(loadHistory());
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [open, cloudActive, drive?.reloadKey]);

  const clearAll = useCallback(async () => {
    if (cloudActive && drive) {
      await Promise.allSettled(entries.map((e) => drive.deleteEntry(Number(e.id))));
      setEntries([]);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setEntries([]);
    }
  }, [cloudActive, drive, entries]);

  const deleteEntry = useCallback(
    async (id: string) => {
      if (cloudActive && drive) {
        await drive.deleteEntry(Number(id));
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } else {
        const updated = entries.filter((e) => e.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setEntries(updated);
      }
    },
    [cloudActive, drive, entries],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9970] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="history-panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[9971] flex w-full max-w-sm flex-col"
          >
            <div className="relative flex h-full flex-col overflow-hidden bg-[oklch(0.12_0.025_264/0.97)] backdrop-blur-2xl shadow-2xl ring-1 ring-white/[0.07]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/[0.07]">
                    <History className="h-4 w-4 text-white/50" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-semibold text-white">
                      Recording History
                    </h2>
                    <p className="text-[11px] text-white/30">
                      {entries.length} session{entries.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entries.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="rounded-lg px-2.5 py-1.5 text-[11px] text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-red-500/10 hover:text-red-400 hover:ring-red-500/20"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drive banner */}
              {!isAuthenticated && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl bg-primary/[0.08] p-3 ring-1 ring-primary/20">
                  <p className="text-[11px] text-white/60">
                    Sign in to back up your history to Google Drive
                  </p>
                  <Link
                    to="/login"
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-white/[0.14]"
                  >
                    <LogIn className="h-3 w-3" />
                    Sign in
                  </Link>
                </div>
              )}
              {isAuthenticated && drive && !cloudActive && drive.connected !== null && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl bg-primary/[0.08] p-3 ring-1 ring-primary/20">
                  <p className="text-[11px] text-white/60">
                    Back up recordings to your Google Drive
                  </p>
                  <button
                    onClick={drive.beginConnect}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-white/[0.14]"
                  >
                    <Cloud className="h-3 w-3" />
                    Connect
                  </button>
                </div>
              )}
              {cloudActive && drive && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl bg-emerald-500/[0.07] p-3 ring-1 ring-emerald-500/20">
                  <p className="text-[11px] text-white/60 truncate">
                    <Cloud className="mr-1 inline h-3 w-3 text-emerald-400" />
                    Synced to {drive.driveEmail || "Google Drive"}
                  </p>
                  <button
                    onClick={() => drive.disconnect()}
                    className="shrink-0 text-[10px] text-white/30 transition-all hover:text-red-400"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                {loading ? (
                  <div className="flex h-full items-center justify-center gap-2 py-16 text-white/30">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Loading history…</span>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.05]">
                      <History className="h-6 w-6 text-white/15" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/30">No recordings yet</p>
                      <p className="mt-1 text-xs text-white/15">
                        Your recording sessions will appear here
                      </p>
                    </div>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05] hover:ring-white/[0.1]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                            <Monitor className="h-3.5 w-3.5 text-primary/70" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/70">
                              {formatResolution(entry.width, entry.height)}
                            </p>
                            <p className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-2.5 w-2.5" />
                              {new Date(entry.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-lg text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {STATS.map(({ icon: Icon, key, label, fmt }) => (
                          <div key={label} className="rounded-lg bg-white/[0.03] p-2">
                            <div className="flex items-center gap-1 mb-0.5">
                              <Icon className="h-2.5 w-2.5 text-white/20" />
                              <span className="text-[9px] uppercase tracking-wider text-white/20">
                                {label}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-white/60">
                              {key === "width" ? fmt(entry[key], entry) : fmt(entry[key])}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[10px] text-white/25 font-mono uppercase">
                          {entry.mimeType.includes("vp9")
                            ? "VP9"
                            : entry.mimeType.includes("vp8")
                              ? "VP8"
                              : "WebM"}
                          {" · "}WebM container
                        </p>
                        {entry.driveUrl && (
                          <a
                            href={entry.driveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] text-primary/70 transition-all hover:text-primary"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                            Open in Drive
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {entries.length > 0 && (
                <div className="border-t border-white/[0.05] px-5 py-3">
                  <p
                    className={cn(
                      "text-center text-[10px]",
                      cloudActive ? "text-emerald-300/30" : "text-white/20",
                    )}
                  >
                    {cloudActive
                      ? "Videos live in your Google Drive — history keeps only metadata"
                      : "History is stored locally on your device"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
