// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMyVenueThunk } from "../../features/venue/venueSlice";
// import { thunkLogout } from "../../features/auth/authSlice";


// export default function ArtistDashboard() {
//   const dispatch = useDispatch();
//   const { user, role } = useSelector((state) => state.auth);
//   const { venue , status } =useSelector((state) => state.venue)

//   useEffect(() => {
//     if (user && role) {
//       dispatch(fetchMyVenueThunk({id:user.id}))
//     }
//   }, [user, role, dispatch]);

//   if (status === "loading" || !venue) return <div>Caricamento profilo...</div>;
// console.log(venue)
//   return (
//     <>
//       <div className="page-bg">
//         <div className="mb-6 text-center ">
//           <div className="w-full max-w-md">
//             <h1 className="text-7xl font-extrabold tracking-tight">Livebook </h1>
//             <h2 className="text-4xl font-extrabold tracking-tight text-gray-400">Dashboard Locale</h2>
//             <p className="help-text mt-1">
//               Benvenuto {venue.venue_name}
//             </p>
//             <p className="help-text mt-1">
//               Questi i tuoi interessi: {venue.duties}
//             </p>
//           </div>
//         </div>
//            <button 
//                 className="btn-primary w-30 py-3 rounded-xl font-semibold"
//                 type="button"
//                 onClick={() => dispatch(thunkLogout())}
//               >
//                 Logout
//               </button>
//       </div>

//       {/* qui dopo metteremo il form */}
//     </>
//   );
// }


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
