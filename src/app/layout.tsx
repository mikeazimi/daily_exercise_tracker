import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Daily Exercise",
  description: "Track your daily workout routine",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Daily Exercise",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen pb-20">
        <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
        <BottomNav />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  );
}
