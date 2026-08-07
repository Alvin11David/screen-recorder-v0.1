export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? "";
  return /Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh/i.test(navigator.userAgent);
}

export const isMac = isMacPlatform();

export const MODIFIER_LABEL = isMac ? "⌥" : "Alt";
