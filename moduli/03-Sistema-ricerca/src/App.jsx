import { useDispatch, useSelector } from "react-redux";
import { setRole } from "./features/auth/authSlice";
import SearchPageArtist from "./components/search/SearchPageArtist";
import SearchPageVenue from "./components/search/SearchPageVenue";

export default function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="page-bg">
      <div className="w-full max-w-5xl space-y-6">
        <div className="glass-card card-inner">
          <h1 className="text-4xl font-extrabold tracking-tight">Modulo 03 — Sistema di Ricerca</h1>
          <p className="help-text mt-1">
            Seleziona il ruolo per provare la ricerca.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              className={`btn-ghost ${role === "artista" ? "bg-white/20" : ""}`}
              onClick={() => dispatch(setRole("artista"))}
            >
              Sono un Artista
            </button>
            <button
              type="button"
              className={`btn-ghost ${role === "locale" ? "bg-white/20" : ""}`}
              onClick={() => dispatch(setRole("locale"))}
            >
              Sono un Locale
            </button>
          </div>
        </div>

        {role === "artista" ? <SearchPageArtist /> : <SearchPageVenue />}
      </div>
    </div>
  );
}
