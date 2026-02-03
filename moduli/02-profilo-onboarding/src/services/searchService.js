
import { supabase } from "../config/supabase";

export async function searchArtists({ q, bio, city, duty, limit = 20 }) {
  let query = supabase
    .from("artists")
    .select("id, artist_name, city, duties")
    .limit(limit);

  if (city) query = query.ilike("city", `%${city}%`);
  if (duty) query = query.contains("duties", [duty]); 
  if (q) query = query.ilike("artist_name", `%${q}%`);
  if(bio) query = query.ilike("bio",`%${bio}%`)
  const {data, error} = await query;
return {data, error};
}

export async function searchVenue({ q, bio, city, duty, limit = 20 }) {
  let query = supabase
    .from("venues")
    .select("id,venue_name,city,duties,bio")
    .limit(limit);
  if (city) query = query.ilike("city", `%${city}%`);
  if (duty) query = query.contains("duties", [duty]);
  if (q) query = query.ilike("venue_name", `%${q}%`);
  if(bio) query = query.ilike("bio",`%${bio}%`)
  const {data, error} = await query;
  return {data, error};
}
