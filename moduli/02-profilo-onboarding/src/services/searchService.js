
import { supabase } from "../config/supabase";

export async function searchArtists({ q, city, duty, limit = 20 }) {
  let query = supabase
    .from("artists")
    .select("id, artist_name, city, duties")
    .limit(limit);

  if (city) query = query.ilike("city", `%${city}%`);
  if (duty) query = query.contains("duties", [duty]); 
  if (q) query = query.ilike("artist_name", `%${q}%`);

  return query;
}

export async function searchVenue({ q, city, duty, limit = 20 }) {
  let query = supabase
    .from("venues")
    .select("id,venue_name,city,duties")
    .limit(limit);
  if (city) query = query.ilike("city", `${city}`);
  if (duty) query = query.contains("duties", [duty]);
  if (q) query = query.ilike("venue_name", `${q}`);

  return query;
}
