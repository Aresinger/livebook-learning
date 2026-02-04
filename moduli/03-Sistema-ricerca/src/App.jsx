import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bootstrapAuth, thunkLogout } from "./features/auth/authSlice";
import AuthPage from "./auth/AuthPage";
import SearchPageArtist from "./components/search/SearchPageArtist";
import SearchPageVenue from "./components/search/SearchPageVenue";

export default function App() {
  const dispatch = useDispatch();
  const { user, role, status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (status === "booting") {
    return <div className="page-bg">Caricamento...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="page-bg">
      <div className="w-full max-w-5xl space-y-6">
        <div className="glass-card card-inner">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Modulo 03 — Sistema di Ricerca
              </h1>
              <p className="help-text mt-1">
                Loggato come {role ?? "ruolo sconosciuto"}
                {user?.email ? ` • ${user.email}` : ""}
              </p>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => dispatch(thunkLogout())}
            >
              Logout
            </button>
          </div>
        </div>

        {role === "artista" && <SearchPageArtist />}
        {role === "locale" && <SearchPageVenue />}
        {!role && (
          <div className="glass-card card-inner">
            <p className="help-text">
              Ruolo non riconosciuto. Completa la registrazione o verifica i
              metadata dell'utente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
