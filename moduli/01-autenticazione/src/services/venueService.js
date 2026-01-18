import { supabase } from "../config/supabase";



export function readVenue(userId) {
  return supabase.from("venues").select("*").eq("id", userId).single();
}

export function createVenue(payload) {
  return supabase.from("venues").insert(payload).select().single();
}
