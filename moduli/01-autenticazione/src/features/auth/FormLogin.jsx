import React, { useState } from 'react'
 import { useSelector } from 'react-redux';



export default function FormLogin({handleLogin,signup_artist,signup_venue}) {

const { status, error } = useSelector((state) => state.auth);
const [formLogin,setFormLogin]= useState({
    email: "",
    password: "",
})
function handleChange(e) {
    const { name, value } = e.target;
    setFormLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSubmit(e){
    e.preventDefault();
   handleLogin(formLogin)
  }

  return (
    <>
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
              <form className="card-inner space-y-5" onSubmit={handleSubmit}>
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
                    value={formLogin.email}
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
                    value={formLogin.password}
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
                  disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Accesso in corso..' : 'Accedi'}
                  
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
  )
}
