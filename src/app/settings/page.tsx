"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createClient();
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setExporting(false); return; }

    const { data: sessions } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", user.id);

    const { data: logs } = await supabase
      .from("exercise_logs")
      .select("*")
      .eq("user_id", user.id);

    const exportData = { sessions, exerciseLogs: logs, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-exercise-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and data
        </p>
      </div>

      {/* Data Export */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Data</h2>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
        >
          <div>
            <p className="font-medium">Export Data</p>
            <p className="text-xs text-muted-foreground">Download all workout data as JSON</p>
          </div>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>

      {/* Future Integrations */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Integrations</h2>
        {[
          { name: "cal.ai", desc: "Sync food tracking data", icon: "🍎" },
          { name: "Apple Health", desc: "Import health & activity data", icon: "❤️" },
          { name: "Whoop", desc: "Sync recovery and strain data", icon: "⌚" },
        ].map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{integration.icon}</span>
              <div>
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.desc}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
              Coming Soon
            </span>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg border border-destructive/30 text-destructive px-4 py-3 text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
