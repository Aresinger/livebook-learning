import React from "react";
import { useState } from "react";

export default function FormRegistazioneLocale({comeBack,handleVenueSignUp}) {
const [formVenue, setFormVenue] = useState({
   name:'',
   emailVenue:'',
   passwordVenue:'',

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
                  <label className="label" htmlFor="name">
                    Nome Locale
                  </label>
                  <input
                    id="name"
                    name="name"
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
    </>
  );
}
