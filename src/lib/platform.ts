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
