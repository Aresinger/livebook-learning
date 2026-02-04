
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../features/auth/authSlice";
import { fetchMyArtistThunk, updateMyArtistThunk } from "../../features/artist/artistSlice";
import ArtistProfileForm from "../../features/artist/ArtistProfileForm";

export default function ArtistDashboard() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const { artist, status, error } = useSelector((s) => s.artist);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user?.id && role === "artista") {
      dispatch(fetchMyArtistThunk({ id: user.id }));
    }
  }, [user?.id, role, dispatch]);

  async function handleSave(payload) {
    // payload = { stage_name, city, duties, bio }
    const res = await dispatch(updateMyArtistThunk({ id: user.id, payload }));
    if (updateMyArtistThunk.fulfilled.match(res)) setEditing(false);
  }

  if (status === "loading" || !artist) {
    return <div className="page-bg"><div className="glass-card card-inner">Caricamento profilo...</div></div>;
  }

  return (
    <div className="page-bg">
      <div className="w-full max-w-2xl mx-auto space-y-5">
        <div className="glass-card card-inner">
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Artista</h1>
          <p className="help-text mt-1">Benvenuto {artist.artist_name}</p>

          {error?.message && (
            <p className="text-red-300 text-sm mt-3">{error.message}</p>
          )}

          {!editing ? (
            <div className="mt-4 space-y-2">
              <p><span className="text-white/60">Città:</span> {artist.city || "-"}</p>
              <p><span className="text-white/60">Categorie:</span> {(artist.duties || []).join(", ") || "-"}</p>
              <p><span className="text-white/60">Bio:</span> {artist.bio || "-"}</p>

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
            <ArtistProfileForm
              initialValues={artist}
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
