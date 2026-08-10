export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? "";
  return /Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh/i.test(navigator.userAgent);
}

export const isMac = isMacPlatform();

export const MODIFIER_LABEL = isMac ? "⌥" : "Alt";

export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /Android/i.test(navigator.userAgent) &&
    !/CrOS/i.test(navigator.userAgent)
  );
}

export function isStandalonePwa(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const displayMode = window.matchMedia("(display-mode: standalone)").matches;
  return iosStandalone || displayMode;
}
