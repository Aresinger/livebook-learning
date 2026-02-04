
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../features/auth/authSlice";
import { fetchMyVenueThunk,updateMyVenueThunk } from "../../features/venue/venueSlice";
import VenueProfileForm from "../../features/venue/VenueProfileForm"

export default function ArtistDashboard() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const { venue, status, error } = useSelector((s) => s.venue);
  const [editing, setEditing] = useState(false);
console.log(venue)
  useEffect(() => {
    if (user?.id && role === "locale") {
      dispatch(fetchMyVenueThunk({ id: user.id }));
    }
  }, [user?.id, role, dispatch]);

  async function handleSave(payload) {
    // payload = { venue_name, city, duties, bio }
    const res = await dispatch(updateMyVenueThunk({ id: user.id, payload }));
    if (updateMyVenueThunk.fulfilled.match(res)) setEditing(false);
  }

  if (status === "loading" || !venue) {
    return <div className="page-bg"><div className="glass-card card-inner">Caricamento profilo...</div></div>;
  }

  return (
    <div className="page-bg">
      <div className="w-full max-w-2xl mx-auto space-y-5">
        <div className="glass-card card-inner">
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Locale</h1>
          <p className="help-text mt-1">Benvenuto {venue.venue_name}</p>

          {error?.message && (
            <p className="text-red-300 text-sm mt-3">{error.message}</p>
          )}

          {!editing ? (
            <div className="mt-4 space-y-2">
              <p><span className="text-white/60">Città:</span> {venue.city || "-"}</p>
              <p><span className="text-white/60">Categorie:</span> {(venue.duties || []).join(", ") || "-"}</p>
              <p><span className="text-white/60">Bio:</span> {venue.bio || "-"}</p>

              <div className="flex gap-2 mt-4">
                <button className="btn-primary py-3 rounded-xl font-semibold" type="button" onClick={() => setEditing(true)}>
                  Modifica profilo
                </button>
                <button className="btn-ghost py-3 rounded-xl font-semibold" type="button" onClick={() => dispatch(thunkLogout())}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <VenueProfileForm
              initialValues={venue}
              status={status}
              onSubmit={handleSave}
              onCancel={() => setEditing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
