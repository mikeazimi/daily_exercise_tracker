import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Singleton for Capacitor native app — ensures all components share the
// same GoTrueClient instance so auth state is consistent everywhere.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let nativeClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  // In Capacitor native app, use @supabase/supabase-js directly (localStorage-based)
  // because cookies don't work reliably with the capacitor:// URL scheme
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cap = (window as any).Capacitor;
    if (
      cap != null &&
      typeof cap.isNativePlatform === "function" &&
      cap.isNativePlatform()
    ) {
      if (!nativeClient) {
        nativeClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      }
      return nativeClient;
    }
  }

  // On web, use @supabase/ssr browser client (cookie-based, works with SSR)
  // createBrowserClient already handles singleton internally
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
