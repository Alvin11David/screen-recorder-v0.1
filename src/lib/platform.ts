export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgentData as { platform?: string } | undefined;
  const platform = ua?.platform ?? navigator.platform ?? "";
  return /Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh/i.test(navigator.userAgent);
}

export const isMac = isMacPlatform();

export const MODIFIER_LABEL = isMac ? "⌥" : "Alt";
