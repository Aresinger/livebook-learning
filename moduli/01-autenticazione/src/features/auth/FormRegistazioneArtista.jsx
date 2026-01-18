import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function FormRegistazioneArtista({
  duty,
  comeBack,
  handleArtistSignUp,
}) {
  const  { status , error }= useSelector((state) => state.auth);
console.log(status)
  const [formArtist, setFormArtist] = useState({
    emailArtist: "",
    passwordArtist: "",
    stage_name: "",
    dutySelect: "",
    cityArtist: "",
    avatarArtist: null,
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setFormArtist((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleArtistSignUp(formArtist);
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
              Crea il tuo account da Artista per iniziare.
            </p>
          </div>

          {/* Card */}
          <div className="glass-card">
            <form className="card-inner space-y-5" onSubmit={handleSubmit}>
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
                  value={formArtist.stage_name}
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
                  value={formArtist.emailArtist}
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
                  value={formArtist.passwordArtist}
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
                  value={formArtist.dutySelect}
                  onChange={(e)=>handleChange(e)}
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
                  value={formArtist.cityArtist}
                  onChange={(e) => handleChange(e)}
                  placeholder="Roma"
                />
              </div>
              {/* Immagine profilo */}
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
                  onChange={(e) =>
                    setFormArtist((prev) => ({
                      ...prev,
                      avatarArtist: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </div>
               {status === "failed" && (
                  <p className="text-red-300 text-sm">{error?.message}</p>
                )}

              {/* Main CTA */}
              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-xl font-semibold"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Registrazione in corso..' : 'Registrati'}
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
