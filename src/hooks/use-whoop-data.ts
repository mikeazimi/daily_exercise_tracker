"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export interface WhoopDayData {
  date: string;
  recoveryScore: number | null;
  strain: number | null;
  hrvMs: number | null;
  restingHr: number | null;
  sleepHours: number | null;
  caloriesBurned: number | null;
}

export function useWhoopData() {
  const supabase = createClient();
  const { user } = useAuth();
  const [data, setData] = useState<WhoopDayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) { setLoading(false); return; }

      // Check connection
      const { count } = await supabase
        .from("whoop_tokens")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setIsConnected((count || 0) > 0);

      // Fetch data
      const { data: rows } = await supabase
        .from("whoop_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (rows) {
        setData(rows.map((r: Record<string, unknown>) => ({
          date: r.date as string,
          recoveryScore: r.recovery_score as number | null,
          strain: r.strain as number | null,
          hrvMs: r.hrv_ms as number | null,
          restingHr: r.resting_hr as number | null,
          sleepHours: r.sleep_hours as number | null,
          caloriesBurned: r.calories_burned as number | null,
        })));
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayData = data.find((d) => d.date === todayStr) || null;

  return { data, todayData, loading, isConnected };
}

export function useWhoopSync() {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/whoop/sync", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Sync failed");
      }
    } catch {
      setError("Network error");
    }
    setSyncing(false);
  }, []);

  return { sync, syncing, error };
}
