// Legacy collaboration reference extracted from shopper12/wind-tour-tracker
// Source main commit: 3dbe673f52f36762621795206db626d2efb75816
// This file is archival reference only; it is not imported by the LIVE_TRAVEL_V17 runtime.

import { supabase } from "./supabase/client";

export async function loadScheduleItems() {
  return supabase
    .from("schedule_items")
    .select("*")
    .order("day", { ascending: true })
    .order("sort_index", { ascending: true });
}

export function subscribeScheduleItems(onChange: () => void) {
  const channel = supabase
    .channel("schedule_items")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schedule_items" },
      onChange,
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function updateScheduleItem(id: string, fields: Record<string, unknown>) {
  return supabase.from("schedule_items").update(fields).eq("id", id);
}

export async function insertScheduleItem(fields: Record<string, unknown>) {
  return supabase.from("schedule_items").insert(fields);
}

export async function deleteScheduleItem(id: string) {
  return supabase.from("schedule_items").delete().eq("id", id);
}

export async function restoreOfficialSchedule(rows: Record<string, unknown>[], userId: string) {
  await supabase
    .from("schedule_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  return supabase
    .from("schedule_items")
    .insert(rows.map((row) => ({ ...row, updated_by: userId })));
}
