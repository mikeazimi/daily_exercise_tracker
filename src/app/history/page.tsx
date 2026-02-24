"use client";

import { useProgressData } from "@/hooks/use-progress-data";
import { useBodyMeasurements } from "@/hooks/use-body-measurements";
import { useNutritionHistory } from "@/hooks/use-nutrition-log";
import { useWhoopData } from "@/hooks/use-whoop-data";
import { useProgressPhotos } from "@/hooks/use-progress-photos";
import { CalendarHeatmap } from "@/components/progress/calendar-heatmap";
import { BodyChart } from "@/components/progress/body-chart";
import { NutritionChart } from "@/components/progress/nutrition-chart";
import { WhoopChart } from "@/components/progress/whoop-chart";
import { ForceChart } from "@/components/progress/force-chart";
import { RepChart } from "@/components/progress/rep-chart";
import { HistoryTable } from "@/components/progress/history-table";
import { PhotoGallery } from "@/components/body/photo-gallery";
import { PhotoCompare } from "@/components/body/photo-compare";

export default function HistoryPage() {
  const { sessions, x3Progress, loading } = useProgressData();
  const { measurements } = useBodyMeasurements();
  const { logs: nutritionLogs } = useNutritionHistory();
  const { data: whoopData, isConnected: whoopConnected } = useWhoopData();
  const { photos, deletePhoto } = useProgressPhotos();

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
      <BodyChart data={measurements} />
      <NutritionChart data={nutritionLogs} />
      {whoopConnected && <WhoopChart data={whoopData} />}
      <ForceChart data={x3Progress} />
      <RepChart data={x3Progress} />
      {photos.length > 0 && <PhotoCompare photos={photos} />}
      <PhotoGallery photos={photos} onDelete={deletePhoto} />
      <HistoryTable sessions={sessions} />
    </div>
  );
}
