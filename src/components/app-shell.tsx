"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/nav";
import { useIsPublicRoute } from "@/components/auth/auth-guard";

// Routes that are authenticated but should not show bottom nav
const NO_NAV_ROUTES = ["/setup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isPublicRoute = useIsPublicRoute();
  const pathname = usePathname();
  const hideNav = NO_NAV_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublicRoute || hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="pb-20">
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
