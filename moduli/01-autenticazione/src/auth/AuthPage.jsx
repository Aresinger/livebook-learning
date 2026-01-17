import { useState } from "react";
import { signUp } from "./../services/authService";
import { useDispatch } from "react-redux";
import { loginThunk } from "../features/auth/authSlice";
import FormLogin from "../features/auth/FormLogin";
import FormRegistazioneArtista from "../features/auth/FormRegistazioneArtista";
import FormRegistazioneLocale from "../features/auth/FormRegistazioneLocale";

export default function AuthPage() {
  const [view, setView] = useState("login");
  
  const dispatch = useDispatch();


 function handleLogin(formLogin) {
    
    dispatch(
      loginThunk({ email: formLogin.email, password: formLogin.password })
    );
  }

  async function handleArtistSignUp(formArtist) {

    const { data, error } = await signUp(
      formArtist.emailArtist,
      formArtist.passwordArtist,
      "artista"
    );
   
    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account creato! Controlla la mail e conferma. Poi torna qui e fai login."
    );
    setView("login");
  }


  async function handleVenueSignUp(formVenue) {
    
    const { data, error } = await signUp(
      formVenue.emailVenue,
      formVenue.passwordVenue,
      "locale"
    );
    
    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account creato! Controlla la mail e conferma. Poi torna qui e fai login."
    );
    setView("login");
  }

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
        <FormLogin
          signup_artist={signup_artist}
          signup_venue={signup_venue}
          handleLogin={handleLogin}
         
          
        />
      )}
      {view === "artista" && (
        <FormRegistazioneArtista
          comeBack={comeBack}
          duty={duty}
          handleArtistSignUp={handleArtistSignUp}
        />
      )}
      {view === "locale" && (
        <FormRegistazioneLocale handleVenueSignUp={handleVenueSignUp} comeBack={comeBack} />
      )}
    </>
  );
}
