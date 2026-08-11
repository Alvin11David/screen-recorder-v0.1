import { Capacitor } from "@capacitor/core";

export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isNativeAndroid(): boolean {
  return isNativePlatform() && Capacitor.getPlatform() === "android";
}

export function getNativeRedirectOrigin(): string {
  if (typeof window === "undefined") return "https://localhost";
  return window.location.origin || "https://localhost";
}
