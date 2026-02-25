"use client";

import { use } from "react";
import Link from "next/link";
import { EXERCISES } from "@/lib/data/exercises";
import { getCatalogExercise } from "@/lib/data/exercise-catalog";
import { useExerciseHistory } from "@/hooks/use-exercise-history";
import { BandTimeline } from "@/components/progress/band-timeline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Try legacy exercises first, then catalog
  const legacyExercise = EXERCISES.find((e) => e.id === id);
  const catalogExercise = getCatalogExercise(id);
  const exercise = legacyExercise || catalogExercise;

  const { history, weightHistory, loading } = useExerciseHistory(id);

  const isWeightExercise = catalogExercise?.trackingType === "reps_weight";
  const isX3Exercise = catalogExercise?.trackingType === "x3" || (legacyExercise && !catalogExercise);

  if (!exercise) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Exercise not found</p>
        <Link href="/history" className="text-primary text-sm mt-2 inline-block">
          Back to Progress
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const exerciseName = "name" in exercise ? exercise.name : "";
  const exerciseSubtitle = legacyExercise
    ? legacyExercise.phaseName
    : catalogExercise
    ? `${catalogExercise.category} · ${catalogExercise.equipment}`
    : "";

  // X3 chart data
  const x3ChartData = history.map((h) => ({
    date: h.date.slice(5),
    force: h.estimatedForceLbs,
    fullReps: h.fullReps,
    partialReps: h.partialReps,
  }));

  // Weight chart data
  const weightChartData = weightHistory.map((h) => ({
    date: h.date.slice(5),
    maxWeight: h.maxWeight,
    volume: Math.round(h.totalVolume),
    sets: h.sets.length,
  }));

  const maxForce = history.length > 0 ? Math.max(...history.map((h) => h.estimatedForceLbs)) : 0;
  const maxReps = history.length > 0 ? Math.max(...history.map((h) => h.fullReps)) : 0;
  const maxWeight = weightHistory.length > 0 ? Math.max(...weightHistory.map((h) => h.maxWeight)) : 0;
  const maxVolume = weightHistory.length > 0 ? Math.max(...weightHistory.map((h) => h.totalVolume)) : 0;

  const hasX3Data = history.length > 0;
  const hasWeightData = weightHistory.length > 0;
  const hasAnyData = hasX3Data || hasWeightData;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/history" className="text-xs text-primary hover:underline">
          &#x2190; Back to Progress
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exerciseName}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {exerciseSubtitle}
        </p>
      </div>

      {!hasAnyData ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No data yet. Complete this exercise to see your progress.
        </p>
      ) : (
        <>
          {/* X3 exercise stats & charts */}
          {hasX3Data && (
            <>
              {/* PR badges */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peak Force</p>
                  <p className="text-lg font-bold text-primary">{maxForce} lbs</p>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Max Reps</p>
                  <p className="text-lg font-bold text-primary">{maxReps}</p>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sessions</p>
                  <p className="text-lg font-bold">{history.length}</p>
                </div>
              </div>

              {/* Force chart */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Force Progression</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={x3ChartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} width={40} />
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Line type="monotone" dataKey="force" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Peak Force (lbs)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Reps chart */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Rep Progression</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={x3ChartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} width={30} />
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Bar dataKey="fullReps" fill="#f97316" radius={[4, 4, 0, 0]} name="Full Reps" />
                      <Bar dataKey="partialReps" fill="#f97316" opacity={0.4} radius={[4, 4, 0, 0]} name="Partial Reps" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Band timeline */}
              <BandTimeline history={history} />

              {/* Raw history */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">History</h3>
                <div className="space-y-1">
                  {[...history].reverse().map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs"
                    >
                      <span className="text-muted-foreground">{h.date}</span>
                      <span>{h.bandName}</span>
                      <span>{h.fullReps}+{h.partialReps} reps</span>
                      <span className="text-primary font-medium">{h.estimatedForceLbs} lbs</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Weight exercise stats & charts */}
          {hasWeightData && (
            <>
              {/* Stats badges */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Max Weight</p>
                  <p className="text-lg font-bold text-primary">{maxWeight} lbs</p>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Best Volume</p>
                  <p className="text-lg font-bold text-primary">{maxVolume.toLocaleString()}</p>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sessions</p>
                  <p className="text-lg font-bold">{weightHistory.length}</p>
                </div>
              </div>

              {/* Weight progression chart */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Weight Progression</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightChartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} width={40} />
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Line type="monotone" dataKey="maxWeight" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Max Weight (lbs)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume chart */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Volume Progression</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weightChartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} width={50} />
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Bar dataKey="volume" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Volume (lbs)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weight history list */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">History</h3>
                <div className="space-y-2">
                  {[...weightHistory].reverse().map((session, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card px-3 py-2 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{session.date}</span>
                        <span className="text-xs text-primary font-medium">
                          {session.maxWeight} lbs max
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {session.sets.map((set, j) => (
                          <span key={j} className="text-[11px] text-muted-foreground">
                            Set {set.setNumber}: {set.weightLbs}×{set.reps}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
