"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

const PUBLIC_ROUTES = ["/login", "/auth"];

export function useIsPublicRoute() {
  const pathname = usePathname();
  return PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = useIsPublicRoute();
  const { user, loading } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isPublicRoute && !loading && !user) {
      router.push("/login");
    }
  }, [isPublicRoute, loading, user, router]);

  // Check onboarding status for authenticated users
  useEffect(() => {
    if (!user || loading) return;
    // Don't check if already on setup or public route
    if (pathname.startsWith("/setup") || pathname.startsWith("/login") || pathname.startsWith("/auth")) {
      setOnboardingChecked(true);
      return;
    }

    const supabase = createClient();
    supabase
      .from("user_settings")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data || !data.onboarding_completed) {
          router.push("/setup");
        } else {
          setOnboardingChecked(true);
        }
      });
  }, [user, loading, pathname, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading || (!onboardingChecked && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
