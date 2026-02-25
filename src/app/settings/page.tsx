"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useBodyMeasurements } from "@/hooks/use-body-measurements";
import { useWhoopData } from "@/hooks/use-whoop-data";
import { MeasurementForm } from "@/components/body/measurement-form";
import { WhoopConnect } from "@/components/whoop/whoop-connect";
import { toCSV } from "@/lib/export/csv";
import { isNativeApp } from "@/lib/capacitor";
import { cn } from "@/lib/utils";
import Link from "next/link";

const REST_OPTIONS = [30, 60, 90, 120];
const DELOAD_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "4 weeks", value: 4 },
  { label: "5 weeks", value: 5 },
  { label: "6 weeks", value: 6 },
];

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [exporting, setExporting] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const { latest, saving: bodySaving, saveMeasurement } = useBodyMeasurements();
  const { isConnected: whoopConnected } = useWhoopData();

  const [restTimerSeconds, setRestTimerSeconds] = useState(90);
  const [deloadWeeks, setDeloadWeeks] = useState(4);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = localStorage.getItem("rest-timer-seconds");
    if (stored) setRestTimerSeconds(parseInt(stored, 10));
    const storedDeload = localStorage.getItem("deload-frequency-weeks");
    if (storedDeload) setDeloadWeeks(parseInt(storedDeload, 10));
  }, []);

  function handleRestTimerChange(seconds: number) {
    setRestTimerSeconds(seconds);
    localStorage.setItem("rest-timer-seconds", String(seconds));
  }

  function handleDeloadChange(weeks: number) {
    setDeloadWeeks(weeks);
    localStorage.setItem("deload-frequency-weeks", String(weeks));
  }

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
    a.download = `daily-exercise-export-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  async function handleExportCSV() {
    setExportingCSV(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setExportingCSV(false); return; }

    const { data: sessions } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    const { data: logs } = await supabase
      .from("exercise_logs")
      .select("*")
      .eq("user_id", user.id);

    const sessionMap = new Map((sessions || []).map((s: Record<string, unknown>) => [s.id, s]));

    const headers = ["date", "workout_type", "exercise_id", "completed", "band_id", "full_reps", "partial_reps", "estimated_force_lbs", "notes"];
    const rows = (logs || []).map((log: Record<string, unknown>) => {
      const s = sessionMap.get(log.session_id) as Record<string, unknown> | undefined;
      return [
        s?.date ?? "",
        s?.workout_type ?? "",
        log.exercise_id,
        log.completed ? "yes" : "no",
        log.band_id ?? "",
        log.full_reps ?? "",
        log.partial_reps ?? "",
        log.estimated_force_lbs ?? "",
        s?.notes ?? "",
      ];
    });

    const csv = toCSV(headers, rows as (string | number | null)[][]);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-exercise-export-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportingCSV(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and data
        </p>
      </div>

      {/* Body Composition */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Body Composition</h2>
        {latest && (
          <div className="text-xs text-muted-foreground">
            Last recorded: {latest.weightLbs && `${latest.weightLbs} lbs`}
            {latest.weightLbs && latest.bodyFatPct && " · "}
            {latest.bodyFatPct && `${latest.bodyFatPct}% BF`}
            {latest.date && ` (${latest.date})`}
          </div>
        )}
        <div className="rounded-lg border border-border bg-card p-4">
          <MeasurementForm
            initialWeight={latest?.weightLbs}
            initialBodyFat={latest?.bodyFatPct}
            saving={bodySaving}
            onSave={(w, bf) => saveMeasurement(today, w, bf)}
          />
        </div>
      </div>

      {/* Workout Program */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Workout Program</h2>
        <Link
          href="/settings/program"
          className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">&#x1F3CB;&#xFE0F;</span>
            <div>
              <p className="font-medium">Customize Program</p>
              <p className="text-xs text-muted-foreground">Build your weekly workout schedule</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      {/* Workout Preferences */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Workout</h2>

        {/* Rest Timer */}
        <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
          <p className="text-sm font-medium">Rest Timer</p>
          <p className="text-xs text-muted-foreground">Countdown between exercises</p>
          <div className="flex gap-2">
            {REST_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleRestTimerChange(s)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  restTimerSeconds === s
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                )}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Deload Frequency */}
        <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
          <p className="text-sm font-medium">Deload Reminder</p>
          <p className="text-xs text-muted-foreground">Suggest reduced intensity every N weeks</p>
          <div className="flex gap-2">
            {DELOAD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDeloadChange(opt.value)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  deloadWeeks === opt.value
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Integrations</h2>
        {!isNativeApp() && <WhoopConnect isConnected={whoopConnected} />}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">&#x2764;&#xFE0F;</span>
            <div>
              <p className="text-sm font-medium">Apple Health</p>
              <p className="text-xs text-muted-foreground">Import health & activity data</p>
            </div>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
            Coming Soon
          </span>
        </div>
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
            <p className="font-medium">Export JSON</p>
            <p className="text-xs text-muted-foreground">Download all workout data as JSON</p>
          </div>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
        <button
          onClick={handleExportCSV}
          disabled={exportingCSV}
          className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
        >
          <div>
            <p className="font-medium">Export CSV</p>
            <p className="text-xs text-muted-foreground">Download workout logs as spreadsheet</p>
          </div>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
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
