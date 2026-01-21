import { supabase } from "../config/supabase";

export async function createProfile(userId, role,email) {
  return supabase.from("profiles").insert({ id: userId, role , email }).select().single();
}

export async function readProfile(userId) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}


export async function updateRole(userId, role) {
  return supabase.from("profiles").update({ role }).eq("id", userId).select().single();
}
export async function readProfileEmail(email) {
  return supabase.from("profiles").select("email").eq("email", email).maybeSingle();
}