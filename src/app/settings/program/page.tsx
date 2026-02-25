"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserProgram } from "@/hooks/use-user-program";
import { ProgramBuilder } from "@/components/program/program-builder";

export default function ProgramSettingsPage() {
  const router = useRouter();
  const { program, loading, saving, saveProgram, deleteProgram } = useUserProgram();
  const [saved, setSaved] = useState(false);

  async function handleSave(
    schedule: import("@/lib/data/program-templates").ProgramSchedule,
    name: string
  ) {
    await saveProgram(schedule, name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    await deleteProgram();
    router.push("/settings");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Workout Program</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize your weekly workout schedule
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Builder */}
      {!loading && (
        <>
          <ProgramBuilder
            initialSchedule={program?.schedule}
            initialName={program?.name}
            saving={saving}
            onSave={handleSave}
            onDelete={program ? handleDelete : undefined}
          />

          {/* Success feedback */}
          {saved && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-4">
              Program saved!
            </div>
          )}
        </>
      )}
    </div>
  );
}
