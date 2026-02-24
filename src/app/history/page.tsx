"use client";

import { useProgressData } from "@/hooks/use-progress-data";
import { CalendarHeatmap } from "@/components/progress/calendar-heatmap";
import { ForceChart } from "@/components/progress/force-chart";
import { RepChart } from "@/components/progress/rep-chart";
import { HistoryTable } from "@/components/progress/history-table";

export default function HistoryPage() {
  const { sessions, x3Progress, loading } = useProgressData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track your workout consistency and strength gains
        </p>
      </div>

      <CalendarHeatmap sessions={sessions} />
      <ForceChart data={x3Progress} />
      <RepChart data={x3Progress} />
      <HistoryTable sessions={sessions} />
    </div>
  );
}
