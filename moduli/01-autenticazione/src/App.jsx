import { useState } from "react";
import {
  signUp,
  signIn,
  signOut,
  getSession,
  resetPassword,
  updatePassword,
} from "./services/authService";
import { createProfile, readProfile } from "./services/profileService";


export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState("");

  function print(step, payload) {
    setLog(JSON.stringify({ step, ...payload }, null, 2));
  }

  async function handleSignup() {
    const { data, error } = await signUp(email, password);
    print("signup", { data, error });
  }

  async function handleLogin() {
    const { data, error } = await signIn(email, password);
    print("login", { data, error });
  }

  async function handleLogout() {
    const { error } = await signOut();
    print("logout", { error });
  }

  async function handleCheckSession() {
    const { data, error } = await getSession();
    print("checkSession", { data, error });
  }

  async function handleCreateProfileArtista() {
    const { data: sData } = await getSession();
    const user = sData?.session?.user;
    if (!user) return print("createProfile", { error: "Non sei loggato" });

    const { data, error } = await createProfile(user.id, "locale");
    print("createProfile", { data, error });
  }

  async function handleReadProfile() {
    const { data: sData } = await getSession();
    const user = sData?.session?.user;
    if (!user) return print("readProfile", { error: "Non sei loggato" });

    const { data, error } = await readProfile(user.id);
    print("readProfile", { data, error });
  }

  async function handleResetPassword() {
    const { data, error } = await resetPassword(email);
    print("resetPassword", { data, error });
  }

  async function handleUpdatePassword() {
    const { data, error } = await updatePassword(password);
    print("updatePassword", { data, error });
  }

  return (
    <div style={{ padding: 20, maxWidth: 620 }}>
      <h2>Mini-Progetto 01 — Auth + Profiles (pulito)</h2>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="password (o nuova password)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <button onClick={handleSignup}>SignUp</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleCheckSession}>Check session</button>

        <button onClick={handleCreateProfileArtista}>Crea profilo (artista)</button>
        <button onClick={handleReadProfile}>Leggi profilo</button>

        <button onClick={handleResetPassword}>Forgot password</button>
        <button onClick={handleUpdatePassword}>Set new password</button>
      </div>

      <pre style={{ marginTop: 16, background: "#111", color: "#0f0", padding: 12, overflow: "auto" }}>
        {log}
      </pre>
      

    </div>

  );
}

// import React from 'react'
// import { BrowserRouter,Route,Routes } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import AuthPage from './auth/AuthPage'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/auth' element={<AuthPage/>}/>
//         <Route/>
//         <Route/>
//         <Route/>
//         <Route/>
//       </Routes>
//     </BrowserRouter>
//   )
// }
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { bootstrapAuth } from "./features/auth/authSlice";
// import AuthPage from "./auth/AuthPage";
// import ArtistDashboard from "./components/dashboard/ArtistDashboard";
// import VenueDashboard from "./components/dashboard/VenueDashboard";

// export default function App() {
//   const dispatch = useDispatch();
//   const { user, role, status } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(bootstrapAuth());
//   }, []);

//   if (status === "booting")
//     return <div className="page-bg">Caricamento...</div>;
//   if (!user) return <AuthPage />;
//   if (role === "artista") return <ArtistDashboard />;
//   if (role === "locale") return <VenueDashboard />;
//   return <div>Ruolo non riconosciuto</div>;
// }
