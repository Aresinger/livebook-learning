import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { readProfileEmail } from "../../services/profileService";

export default function FormRegistazioneLocale({
  comeBack,
  handleVenueSignUp,
  duty,
}) {
  const { status, error } = useSelector((state) => state.auth);
  const [formVenue, setFormVenue] = useState({
    venue_name: "",
    email_venue: "",
    passwordVenue: "",
    avatarVenue: null,
    dutySelect: "",
    cityVenue: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setFormVenue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { data: data, error: error } = await readProfileEmail(
      formVenue.email_venue,
    );
    if (error && error.code !== "PGRST116") {
      return console.log("error " + error.message);
    }
    if (data) {
      return alert("email già registrata");
    }
    handleVenueSignUp(formVenue);
  }

   function toggleDuty(duty) {
    setFormVenue((p) => {
      const exists = p.dutySelect.includes(duty);
      return { ...p, dutySelect: exists ? p.dutySelect.filter((d) => d !== duty) : [...p.dutySelect, duty] };
    });
  }

  return (
    <>
      <div className="page-bg">
        <div className="w-full max-w-md">
          {/* Header */}
          <button className="btn-ghost" onClick={comeBack}>
            {" "}
            Indietro{" "}
          </button>
          <div className="mb-6 text-center">
            <h1 className="text-7xl font-extrabold tracking-tight">Livebook</h1>
            <p className="help-text mt-1">
              Crea il tuo account da Locale per iniziare.
            </p>
          </div>

          {/* Card */}

          <div className="glass-card">
            <form className="card-inner space-y-5" onSubmit={handleSubmit}>
              {/* Nome */}
              <div>
                <label className="label" htmlFor="venue_name">
                  Nome Locale
                </label>
                <input
                  id="venue_name"
                  name="venue_name"
                  type="text"
                  className="input-glass"
                  placeholder="Ristorante dai Massoni"
                  onChange={(e) => handleChange(e)}
                  value={formVenue.name}
                />
              </div>
              {/* Email */}
              <div>
                <label className="label" htmlFor="email_venue">
                  Email
                </label>
                <input
                  id="email_venue"
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  onChange={(e) => handleChange(e)}
                  value={formVenue.email_venue}
                  name="email_venue"
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
                  value={formVenue.passwordVenue}
                  name="passwordVenue"
                />
              </div>
              {/* città */}
              <div>
                <label className="label" htmlFor="cityVenue">
                  Città
                </label>
                <input
                  type="text"
                  id="cityVenue"
                  name="cityVenue"
                  className="input-glass"
                  value={formVenue.cityVenue}
                  onChange={(e) => handleChange(e)}
                  placeholder="Roma"
                />
              </div>
              {/* tipo di artista ricercato*/}
              <div>
                <p className="label mb-2">Che tipo di Artista cerchi?</p>
                <div className="flex flex-wrap gap-2">
                  {duty.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className="btn-ghost"
                      onClick={() => toggleDuty(d)}
                    >
                      {formVenue.dutySelect.includes(d) ? "✅ " : ""}
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              {/* Immagine profilo */}
              <div>
                <label htmlFor="avatarLocale" className="label">
                  Immagine Profilo
                </label>
                <input
                  id="avatarLocale"
                  name="avatarLocale"
                  type="file"
                  accept="image/*"
                  className="input-glass"
                  onChange={(e) =>
                    setFormVenue((prev) => ({
                      ...prev,
                      avatarVenue: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </div>

              {/* Main CTA */}
              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-xl font-semibold"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Registrazione in corso.."
                  : "Registrati"}
              </button>

              {/* Footer note */}
              <p className="text-center text-xs text-white/50">
                Continuando accetti termini e privacy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
