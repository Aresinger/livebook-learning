import React from "react";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function ArtistDashboard() {
  const dispatch= useDispatch()
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
