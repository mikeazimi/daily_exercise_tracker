"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WhoopDayData } from "@/hooks/use-whoop-data";
import { cn } from "@/lib/utils";

interface WhoopChartProps {
  data: WhoopDayData[];
}

type WhoopMetric = "recoveryScore" | "strain" | "hrvMs" | "sleepHours";

const METRICS: { key: WhoopMetric; label: string; color: string; unit: string }[] = [
  { key: "recoveryScore", label: "Recovery", color: "#22c55e", unit: "%" },
  { key: "strain", label: "Strain", color: "#ef4444", unit: "" },
  { key: "hrvMs", label: "HRV", color: "#3b82f6", unit: "ms" },
  { key: "sleepHours", label: "Sleep", color: "#a855f7", unit: "hr" },
];

export function WhoopChart({ data }: WhoopChartProps) {
  const [selected, setSelected] = useState<WhoopMetric>("recoveryScore");
  const metric = METRICS.find((m) => m.key === selected)!;

  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    date: d.date,
    value: d[selected],
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Whoop</h3>

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
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: 12 }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: unknown) => [`${value} ${metric.unit}`, metric.label]}
            />
            <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2} dot={{ fill: metric.color, r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
