"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BodyMeasurement } from "@/hooks/use-body-measurements";

interface BodyChartProps {
  data: BodyMeasurement[];
}

export function BodyChart({ data }: BodyChartProps) {
  const chartData = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({
      date: m.date,
      weight: m.weightLbs,
      bodyFat: m.bodyFatPct,
    }));

  if (chartData.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Body Composition</h3>
        <p className="text-xs text-muted-foreground py-8 text-center">
          No measurements yet. Add your weight in Settings to track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Body Composition</h3>
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
              yAxisId="weight"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "lbs", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#a1a1aa" } }}
            />
            <YAxis
              yAxisId="bf"
              orientation="right"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "%", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "#a1a1aa" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: 12,
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="weight"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", r: 3 }}
              name="Weight (lbs)"
              connectNulls
            />
            <Line
              yAxisId="bf"
              type="monotone"
              dataKey="bodyFat"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", r: 3 }}
              name="Body Fat %"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
