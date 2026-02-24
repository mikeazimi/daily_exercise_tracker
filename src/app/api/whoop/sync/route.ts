import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { refreshAccessToken, fetchRecovery, fetchCycles, fetchSleep } from "@/lib/whoop/client";
import { format, subDays } from "date-fns";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get tokens
  const { data: tokenRow } = await supabase
    .from("whoop_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!tokenRow) {
    return NextResponse.json({ error: "Whoop not connected" }, { status: 400 });
  }

  let accessToken = tokenRow.access_token;

  // Refresh if expired
  if (new Date(tokenRow.expires_at) <= new Date()) {
    try {
      const newTokens = await refreshAccessToken(tokenRow.refresh_token);
      accessToken = newTokens.accessToken;

      await supabase.from("whoop_tokens").update({
        access_token: newTokens.accessToken,
        refresh_token: newTokens.refreshToken,
        expires_at: newTokens.expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id);
    } catch {
      return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
    }
  }

  // Fetch last 7 days
  const end = format(new Date(), "yyyy-MM-dd");
  const start = format(subDays(new Date(), 7), "yyyy-MM-dd");

  try {
    const [recoveryData, cyclesData, sleepData] = await Promise.all([
      fetchRecovery(accessToken, start, end),
      fetchCycles(accessToken, start, end),
      fetchSleep(accessToken, start, end),
    ]);

    // Build a map of date -> metrics
    const dateMap = new Map<string, Record<string, unknown>>();

    // Process cycles (strain + calories)
    for (const cycle of cyclesData.records || []) {
      const date = format(new Date(cycle.start), "yyyy-MM-dd");
      const existing = dateMap.get(date) || {};
      dateMap.set(date, {
        ...existing,
        strain: cycle.score?.strain,
        calories_burned: cycle.score?.kilojoule ? Math.round(cycle.score.kilojoule / 4.184) : null,
      });
    }

    // Process recovery
    for (const rec of recoveryData.records || []) {
      const date = format(new Date(rec.created_at), "yyyy-MM-dd");
      const existing = dateMap.get(date) || {};
      dateMap.set(date, {
        ...existing,
        recovery_score: rec.score?.recovery_score,
        hrv_ms: rec.score?.hrv_rmssd_milli,
        resting_hr: rec.score?.resting_heart_rate,
      });
    }

    // Process sleep
    for (const sleep of sleepData.records || []) {
      const date = format(new Date(sleep.start), "yyyy-MM-dd");
      const existing = dateMap.get(date) || {};
      const durationMs = sleep.score?.stage_summary?.total_in_bed_time_milli;
      dateMap.set(date, {
        ...existing,
        sleep_hours: durationMs ? parseFloat((durationMs / 3600000).toFixed(2)) : null,
      });
    }

    // Upsert all days
    const upserts = Array.from(dateMap.entries()).map(([date, metrics]) => ({
      user_id: user.id,
      date,
      recovery_score: metrics.recovery_score ?? null,
      strain: metrics.strain ?? null,
      hrv_ms: metrics.hrv_ms ?? null,
      resting_hr: metrics.resting_hr ?? null,
      sleep_hours: metrics.sleep_hours ?? null,
      calories_burned: metrics.calories_burned ?? null,
      updated_at: new Date().toISOString(),
    }));

    if (upserts.length > 0) {
      await supabase.from("whoop_data").upsert(upserts, { onConflict: "user_id,date" });
    }

    return NextResponse.json({ synced: upserts.length });
  } catch (err) {
    return NextResponse.json({ error: "Sync failed", details: String(err) }, { status: 500 });
  }
}
