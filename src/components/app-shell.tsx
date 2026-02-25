"use client";

import { BottomNav } from "@/components/nav";
import { useIsPublicRoute } from "@/components/auth/auth-guard";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isPublicRoute = useIsPublicRoute();

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <BottomNav />
    </>
  );
}
