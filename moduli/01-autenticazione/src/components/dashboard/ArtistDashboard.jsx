
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../features/auth/authSlice";

export default function ArtistDashboard() {
  const dispatch= useDispatch()
  
  return (
    <>
      <div>Sei in ArtistDashboard</div>
      <button
        className="btn-primary w-full py-3 rounded-xl font-semibold"
        type="button"
        onClick={() => dispatch(thunkLogout())}
      >
        Logout
      </button>
    </>
  );
}
