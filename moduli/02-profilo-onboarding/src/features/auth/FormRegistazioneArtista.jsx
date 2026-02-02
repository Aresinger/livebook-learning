import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoxNotification from "../../components/shared/ErrorBoxNotification";



export default function FormRegistazioneArtista({
  duty,
  comeBack,
  handleArtistSignUp,
  emailEx,
  setEmailEx
}) {
  
  const { status, error } = useSelector((state) => state.auth);
  console.log(status);
  const [formArtist, setFormArtist] = useState({
    email_artist: "",
    passwordArtist: "",
    stage_name: "",
    dutySelect: [],
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

  async function handleSubmit(e) {
    e.preventDefault();
    handleArtistSignUp(formArtist);
  }


   function toggleDuty(duty) {
    setFormArtist((p) => {
      const exists = p.dutySelect.includes(duty);
      return { ...p, dutySelect: exists ? p.dutySelect.filter((d) => d !== duty) : [...p.dutySelect, duty] };
    });
  }

  return (
    <>
      <div className="page-bg">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="fixed ">

          <button className="btn-ghost backdrop-blur-md " onClick={comeBack}>
            {" "}
            Indietro{" "}
          </button>
          </div>
          <div className="mb-6 mt-9 text-center">
            <h1 className="text-7xl font-extrabold tracking-tight">Livebook</h1>
            <p className="help-text mt-1">
              Crea il tuo account da Artista per iniziare.
            </p>
          </div>
     

          {/* Card */}
          <div className={ emailEx?.error ? 'glass-card disabled' : 'glass-card'}>
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
                <label className="label" htmlFor="email_artist">
                  Email
                </label>
                <input
                  id="email_artist"
                  name="email_artist"
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  onChange={(e) => handleChange(e)}
                  value={formArtist.email_artist}
                  onBlur={(e) => handleOnBlur(e)}
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
                <p className="label mb-2">Che tipo di Artista sei?</p>
                <div className="flex flex-wrap gap-2">
                  {duty.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className="btn-ghost"
                      onClick={() => toggleDuty(d)}
                    >
                      {formArtist.dutySelect.includes(d) ? "✅ " : ""}
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
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
              {/* {emailEx ?? 
                <p className="text-red-300 text-sm">Email già registrata</p>
                } */}

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
            {emailEx?.error && <ErrorBoxNotification setEmailEx={setEmailEx} emailEx={emailEx}/>}
       
        </div>
      </div>
    </>
  );
}
