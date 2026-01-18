import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function FormRegistazioneLocale({comeBack,handleVenueSignUp,duty}) {

  const { status, error }= useSelector((state) => state.auth)
const [formVenue, setFormVenue] = useState({
   venue_name:'',
   emailVenue:'',
   passwordVenue:'',
   avatarVenue: null,
   dutySelect: '',
   cityVenue:''

})
function handleChange(e) {
    const { name, value } = e.target;
    setFormVenue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

    function handleSubmit(e){
        e.preventDefault();
        handleVenueSignUp(formVenue)
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
                <label className="label" htmlFor="emailVenue">
                  Email
                </label>
                <input
                  id="emailVenue"
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  onChange={(e) => handleChange(e)}
                  value={formVenue.emailVenue}
                  name="emailVenue"
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
                <label className="label" htmlFor="dutiesArtist">
                  Che tipo di Artista cerchi?
                </label>
                <select
                  id="dutiesArtist"
                  className="input-glass"
                  value={formVenue.dutySelect}
                  onChange={(e) => handleChange(e)}
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
                disabled={status === 'loggingIn'}
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
    </>
  );
}
