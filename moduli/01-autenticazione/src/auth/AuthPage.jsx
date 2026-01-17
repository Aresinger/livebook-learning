import { useState } from "react";
import { signUp } from "./../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginThunk } from "../store/auth/authSlice";

export default function AuthPage() {
  const [view, setView] = useState("login");
  const { status, error } = useSelector((state) => state.auth);
  const [avatarFile, setAvatarFile] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    stage_name: "",
    emailArtist: "",
    passwordArtist: "",
    dutySelect: "",
    cityArtist: "",
    avatarArtist: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    dispatch(
      loginThunk({ email: formData.email, password: formData.password })
    );
  }

  async function handleArtistSignUp(e) {
    e.preventDefault();
    const { data, error } = await signUp(
      formData.emailArtist,
      formData.passwordArtist,
      "artista"
    );
    console.log("SIGNUP ARTIST", { data, error });
    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account creato! Controlla la mail e conferma. Poi torna qui e fai login."
    );
    setView("login");
  }

  //   async function handleLogout() {
  //     const { error } = await signOut();
  //     console.log("logout", { error });
  //   }

  function signup_artist() {
    setView("artista");
  }
  function signup_venue() {
    setView("locale");
  }
  function comeBack() {
    setView("login");
  }
  const duty = [
    "cantante",
    "ballerino/a",
    "circense",
    "artista generico",
    "gruppo musicale",
  ];
  return (
    <>
      {view === "login" && (
        <div className="page-bg">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-6 text-center ">
              <h1 className="text-7xl font-extrabold tracking-tight">
                Livebook
              </h1>
              <p className="help-text mt-1">
                Accedi o crea un account per iniziare.
              </p>
            </div>

            {/* Card */}
            <div className="glass-card">
              <form className="card-inner space-y-5" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="input-glass"
                    placeholder="you@example.com"
                    onChange={(e) => handleChange(e)}
                    value={formData.email}
                  />
                  {/* error (se vuoi) */}
                  {/* <p className="error-text">Email non valida</p> */}
                </div>

                {/* Password */}
                <div>
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="input-glass"
                    placeholder="Min. 8 caratteri"
                    onChange={(e) => handleChange(e)}
                    value={formData.password}
                  />
                </div>

                {/* Extra row */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="underline decoration-white/30 hover:text-white"
                  >
                    Password dimenticata?
                  </button>
                </div>
                <div className="justify-self-center">
                  <p className="text-center text-xl text-white/100">
                    Registrati come:
                  </p>
                  <button
                    type="button"
                    className="btn-ghost m-1.5"
                    onClick={signup_artist}
                  >
                    Artista
                  </button>
                  <button
                    type="button"
                    className="btn-ghost "
                    onClick={signup_venue}
                  >
                    Locale
                  </button>
                </div>
                {status === "failed" && (
                  <p className="text-red-300 text-sm">{error?.message}</p>
                )}
                {/* Main CTA */}
                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-xl font-semibold"
                >
                  Accedi
                </button>
                <button
                  className="btn-primary w-full py-3 rounded-xl font-semibold"
                  type="button"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </button>

                {/* Footer note */}
                <p className="text-center text-xs text-white/50">
                  Continuando accetti termini e privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      {view === "artista" && (
        <div className="page-bg">
          <div className="w-full max-w-md">
            {/* Header */}
            <button className="btn-ghost" onClick={comeBack}>
              {" "}
              Indietro{" "}
            </button>
            <div className="mb-6 text-center">
              <h1 className="text-7xl font-extrabold tracking-tight">
                Livebook
              </h1>
              <p className="help-text mt-1">
                Crea il tuo account da Artista per iniziare.
              </p>
            </div>

            {/* Card */}
            <div className="glass-card">
              <form
                className="card-inner space-y-5"
                onSubmit={handleArtistSignUp}
              >
                {/* nome  */}
                <div>
                  <label className="label" htmlFor="stage_name">
                    Nome Artista
                  </label>
                  <input
                    id="stage_name"
                    name="stage_name"
                    type="text"
                    className="input-glass"
                    placeholder="Bob Singer"
                    onChange={(e) => handleChange(e)}
                    value={formData.stage_name}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="label" htmlFor="emailArtist">
                    Email
                  </label>
                  <input
                    id="emailArtist"
                    name="emailArtist"
                    type="email"
                    className="input-glass"
                    placeholder="you@example.com"
                    onChange={(e) => handleChange(e)}
                    value={formData.emailArtist}
                  />
                  {/* error (se vuoi) */}
                  {/* <p className="error-text">Email non valida</p> */}
                </div>

                {/* Password */}
                <div>
                  <label className="label" htmlFor="passwordArtist">
                    Password
                  </label>
                  <input
                    id="passwordArtist"
                    name="passwordArtist"
                    type="password"
                    className="input-glass"
                    placeholder="Min. 8 caratteri"
                    onChange={(e) => handleChange(e)}
                    value={formData.passwordArtist}
                  />
                </div>
                {/* tipo di artista */}
                <div>
                  <label className="label" htmlFor="dutiesArtist">
                    Che tipo di Artista sei?
                  </label>
                  <select
                    id="dutiesArtist"
                    className="input-glass"
                    value={formData.dutySelect}
                    onChange={handleChange}
                    name="dutySelect"
                  >
                    <option disabled value="">
                      Seleziona un opzione
                    </option>

                    {duty.map((duty) => {
                      // console.log(duty.toUpperCase())
                      return (
                        <option value={duty} key={duty}>
                          {duty.toUpperCase()}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* città */}
                <div>
                  <label className="label" htmlFor="cityArtist">
                    Città
                  </label>
                  <input
                    type="text"
                    id="cityArtist"
                    name="cityArtist"
                    className="input-glass"
                    value={formData.cityArtist}
                    onChange={(e) => handleChange(e)}
                    placeholder="Roma"
                  />
                </div>
                <div>
                  <label htmlFor="avatarArtist" className="label">
                    Immagine Profilo
                  </label>
                  <input
                    id="avatarArtist"
                    name="avatarArtist"
                    type="file"
                    accept="image/*"
                    className="input-glass"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                {/* Main CTA */}
                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-xl font-semibold"
                >
                  Registrati
                </button>

                {/* Footer note */}
                <p className="text-center text-xs text-white/50">
                  Continuando accetti termini e privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      {view === "locale" && (
        <div className="page-bg">
          <div className="w-full max-w-md">
            {/* Header */}
            <button className="btn-ghost" onClick={comeBack}>
              {" "}
              Indietro{" "}
            </button>
            <div className="mb-6 text-center">
              <h1 className="text-7xl font-extrabold tracking-tight">
                Livebook
              </h1>
              <p className="help-text mt-1">
                Crea il tuo account da Locale per iniziare.
              </p>
            </div>

            {/* Card */}
            <div className="glass-card">
              <form className="card-inner space-y-5">
                {/* Email */}
                <div>
                  <label className="label" htmlFor="emailVenue">
                    Email
                  </label>
                  <input
                    id="emailVenue"
                    type="email"
                    className="input-glass"
                    placeholder="you@example.com"
                    onChange={(e) => handleChange(e)}
                  />
                  {/* error (se vuoi) */}
                  {/* <p className="error-text">Email non valida</p> */}
                </div>

                {/* Password */}
                <div>
                  <label className="label" htmlFor="passwordVenue">
                    Password
                  </label>
                  <input
                    id="passwordVenue"
                    type="password"
                    className="input-glass"
                    placeholder="Min. 8 caratteri"
                    onChange={(e) => handleChange(e)}
                  />
                </div>

                {/* Main CTA */}
                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-xl font-semibold"
                >
                  Registrati
                </button>

                {/* Footer note */}
                <p className="text-center text-xs text-white/50">
                  Continuando accetti termini e privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
