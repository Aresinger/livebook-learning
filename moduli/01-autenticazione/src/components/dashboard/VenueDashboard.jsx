
import { thunkLogout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function VenueDashboard() {

  const dispatch= useDispatch();

  return (
    <>
      <div>Sei in VenueDashboard</div>
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
