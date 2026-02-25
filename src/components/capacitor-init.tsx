"use client";

import { useEffect } from "react";

export function CapacitorInit() {
  useEffect(() => {
    async function init() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cap = (window as any).Capacitor;
      if (!cap || typeof cap.isNativePlatform !== "function") return;
      if (!cap.isNativePlatform()) return;

      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Dark });
      } catch {
        // StatusBar not available
      }

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch {
        // SplashScreen not available
      }
    }
    init();
  }, []);

  return null;
}
