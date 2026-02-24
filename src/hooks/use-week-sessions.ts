"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, startOfWeek, endOfWeek } from "date-fns";

export type DayStatus = "completed" | "started" | "rest" | "none";

export function useWeekSessions(weekDate: Date): Map<string, DayStatus> {
  const supabase = createClient();
  const [statuses, setStatuses] = useState<Map<string, DayStatus>>(new Map());

  const weekStart = format(startOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

  useEffect(() => {
    async function loadWeek() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("date, completed_at")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .lte("date", weekEnd);

      const map = new Map<string, DayStatus>();
      if (sessions) {
        for (const s of sessions) {
          map.set(s.date, s.completed_at ? "completed" : "started");
        }
      }
      setStatuses(map);
    }
    loadWeek();
  }, [weekStart, weekEnd, supabase]);

  return statuses;
}
