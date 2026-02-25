"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

const PUBLIC_ROUTES = ["/login", "/auth"];

export function useIsPublicRoute() {
  const pathname = usePathname();
  return PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isPublicRoute = useIsPublicRoute();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!isPublicRoute && !loading && !user) {
      router.push("/login");
    }
  }, [isPublicRoute, loading, user, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading) {
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
