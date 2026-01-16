import { supabase } from "../config/supabase";

export async function createProfile(userId, role) {
  return supabase.from("profiles").insert({ id: userId, role }).select().single();
}

export async function readProfile(userId) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateRole(userId, role) {
  return supabase.from("profiles").update({ role }).eq("id", userId).select().single();
}
