import React from "react";

export default function ArtistDashboard({logout}) {
  return (
    <>
      <div>Sei in ArtistDashboard</div>
      <button
        className="btn-primary w-full py-3 rounded-xl font-semibold"
        type="button"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </>
  );
}
