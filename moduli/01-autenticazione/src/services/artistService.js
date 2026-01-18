import { supabase } from "../config/supabase";



export function readArtist(userId) {
  return supabase.from("artists").select("*").eq("id", userId).single();
}

export function createArtist(payload) {
  return supabase.from("artists").insert(payload).select().single();
}
