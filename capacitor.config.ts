import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dailyexercise.app",
  appName: "Daily Exercise",
  webDir: "out",
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#09090b",
      showSpinner: false,
      launchShowDuration: 500,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#09090b",
    },
    Keyboard: {
      resize: "body",
      scrollAssist: true,
    },
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
