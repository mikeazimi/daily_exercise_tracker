"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import type { X3ProgressPoint } from "@/hooks/use-progress-data";
import { cn } from "@/lib/utils";

interface ForceChartProps {
  data: X3ProgressPoint[];
}

export function ForceChart({ data }: ForceChartProps) {
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
        force: d.estimatedForceLbs,
        fullReps: d.fullReps,
        partialReps: d.partialReps,
        band: d.bandName,
      }));
  }, [data, selectedExercise]);

  if (data.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">X3 Force Progression</h3>
        <p className="text-xs text-muted-foreground py-8 text-center">
          No X3 data yet. Complete some X3 exercises to see your force progression.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">X3 Force Progression</h3>

      {/* Exercise filter */}
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

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                label={{
                  value: "lbs",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#a1a1aa" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: unknown, name: unknown) => {
                  if (name === "force") return [`${value} lbs`, "Peak Force"];
                  return [`${value}`, `${name}`];
                }}
              />
              <Line
                type="monotone"
                dataKey="force"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
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
