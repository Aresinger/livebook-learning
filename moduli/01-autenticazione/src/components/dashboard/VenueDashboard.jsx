import React from "react";

export default function VenueDashboard({logout}) {
  return (
    <>
      <div>Sei in VenueDashboard</div>
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
