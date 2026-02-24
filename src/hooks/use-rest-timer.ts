"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useRestTimer(defaultSeconds: number = 90) {
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const workerCode = `
      let interval = null;
      let remaining = 0;
      self.onmessage = (e) => {
        if (e.data.type === 'start') {
          if (interval) clearInterval(interval);
          remaining = e.data.seconds;
          self.postMessage({ remaining });
          interval = setInterval(() => {
            remaining--;
            self.postMessage({ remaining });
            if (remaining <= 0) { clearInterval(interval); interval = null; }
          }, 1000);
        }
        if (e.data.type === 'stop') {
          if (interval) { clearInterval(interval); interval = null; }
          self.postMessage({ remaining: 0 });
        }
      };
    `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);
    workerRef.current.onmessage = (e) => {
      const r = e.data.remaining;
      setRemaining(r);
      if (r <= 0) {
        setIsRunning(false);
        try {
          navigator.vibrate?.(500);
        } catch {}
        // Play beep via Web Audio
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } catch {}
      }
    };
    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(url);
    };
  }, []);

  const start = useCallback((seconds?: number) => {
    const s = seconds ?? defaultSeconds;
    setRemaining(s);
    setIsRunning(true);
    workerRef.current?.postMessage({ type: "start", seconds: s });
  }, [defaultSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setRemaining(0);
    workerRef.current?.postMessage({ type: "stop" });
  }, []);

  return { remaining, isRunning, start, stop };
}
