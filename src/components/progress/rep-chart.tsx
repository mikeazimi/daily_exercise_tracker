"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";
import type { X3ProgressPoint } from "@/hooks/use-progress-data";
import { cn } from "@/lib/utils";

interface RepChartProps {
  data: X3ProgressPoint[];
}

export function RepChart({ data }: RepChartProps) {
  const exercises = useMemo(() => {
    const unique = new Map<string, string>();
    for (const d of data) {
      unique.set(d.exerciseId, d.exerciseName);
    }
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const [selectedExercise, setSelectedExercise] = useState<string>(
    exercises[0]?.id || ""
  );

  const chartData = useMemo(() => {
    return data
      .filter((d) => d.exerciseId === selectedExercise)
      .map((d) => ({
        date: d.date,
        fullReps: d.fullReps,
        partialReps: d.partialReps,
        band: d.bandName,
      }));
  }, [data, selectedExercise]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Rep Progression</h3>

      <div className="flex gap-1.5 flex-wrap">
        {exercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedExercise(ex.id)}
            className={cn(
              "px-2 py-1 text-[11px] rounded-md border transition-all",
              selectedExercise === ex.id
                ? "border-primary bg-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {ex.name}
          </button>
        ))}
        {selectedExercise && (
          <Link
            href={`/exercise/${selectedExercise}`}
            className="px-2 py-1 text-[11px] rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
          >
            Details &rarr;
          </Link>
        )}
      </div>

      {chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="fullReps" fill="#f97316" name="Full Reps" radius={[2, 2, 0, 0]} />
              <Bar dataKey="partialReps" fill="#f97316" opacity={0.4} name="Partial Reps" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground py-4 text-center">
          No data for this exercise yet.
        </p>
      )}
    </div>
  );
}
