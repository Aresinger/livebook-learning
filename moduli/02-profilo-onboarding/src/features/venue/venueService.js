import { supabase } from "../../config/supabase";



export function readVenue(userId) {
  return supabase.from("venues").select("*").eq("id", userId).maybeSingle();
}

export function createVenue(payload) {
  return supabase.from("venues").insert(payload).select().single();
}

export async function updateVenue(id, payload) {
  return supabase.from("venues").update(payload).eq("id", id).select().maybeSingle();
}
