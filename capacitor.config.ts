import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.screencapture.app",
  appName: "ScreenFlow",
  webDir: "dist-native",
  android: {
    allowMixedContent: true,
  },
};

export default config;
