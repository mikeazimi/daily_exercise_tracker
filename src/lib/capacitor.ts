export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cap = (window as any).Capacitor;
  return (
    cap != null &&
    typeof cap.isNativePlatform === "function" &&
    cap.isNativePlatform()
  );
}
