"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const PUBLIC_ROUTES = ["/login", "/auth"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const { loading, authenticated } = useAuthGuard(isPublicRoute);

  useEffect(() => {
    if (!isPublicRoute && !loading && !authenticated) {
      router.push("/login");
    }
  }, [isPublicRoute, loading, authenticated, router]);

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

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
