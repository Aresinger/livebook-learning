import { supabase } from "../../config/supabase";

export function readArtist(userId) {
  return supabase.from("artists").select("*").eq("id", userId).maybeSingle();
}

export function createArtist(payload) {
  return supabase.from("artists").insert(payload).select().single();
}

export async function updateArtist(id, payload) {
  return supabase
    .from("artists")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
}

