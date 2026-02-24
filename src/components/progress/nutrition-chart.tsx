"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { NutritionLog } from "@/hooks/use-nutrition-log";
import { cn } from "@/lib/utils";

interface NutritionChartProps {
  data: NutritionLog[];
}

type Metric = "calories" | "proteinG" | "carbsG" | "fatG";

const METRICS: { key: Metric; label: string; color: string; unit: string }[] = [
  { key: "calories", label: "Calories", color: "#f97316", unit: "cal" },
  { key: "proteinG", label: "Protein", color: "#22c55e", unit: "g" },
  { key: "carbsG", label: "Carbs", color: "#3b82f6", unit: "g" },
  { key: "fatG", label: "Fat", color: "#eab308", unit: "g" },
];

export function NutritionChart({ data }: NutritionChartProps) {
  const [selected, setSelected] = useState<Metric>("calories");
  const metric = METRICS.find((m) => m.key === selected)!;

  if (data.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Nutrition</h3>
        <p className="text-xs text-muted-foreground py-8 text-center">
          No nutrition data yet. Log your macros to see trends.
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: d.date,
    value: d[selected],
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Nutrition</h3>

      <div className="flex gap-1.5 flex-wrap">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className={cn(
              "px-2 py-1 text-[11px] rounded-md border transition-all",
              selected === m.key
                ? "border-primary bg-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

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
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: unknown) => [`${value} ${metric.unit}`, metric.label]}
            />
            <Bar dataKey="value" fill={metric.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
