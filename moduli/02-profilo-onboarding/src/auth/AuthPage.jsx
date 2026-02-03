import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  bootstrapAuth,
  loginThunk,
  signUpThunk,
} from "../features/auth/authSlice";
import FormLogin from "../features/auth/FormLogin";
import FormRegistazioneArtista from "../features/auth/FormRegistazioneArtista";
import FormRegistazioneLocale from "../features/auth/FormRegistazioneLocale";


export default function AuthPage() {
  const [view, setView] = useState("login");
  const [emailEx, setEmailEx] = useState({
    error: false,
    message: ''
  });
  const [confirmation,setConfirmation] = useState({
    active: false,
    message: ''
  })

  const dispatch = useDispatch();

  async function handleLogin(formLogin) {
    const res = await dispatch(
      loginThunk({ email: formLogin.email, password: formLogin.password }),
    );
    if (loginThunk.fulfilled.match(res)) {
      await dispatch(bootstrapAuth());
    }
  }

  async function handleArtistSignUp(formArtist) {
  

    /// Con questa funzione posso gestire gli stati ; modifica al bottone status === 'loading'
    const action = await dispatch(
      signUpThunk({
        email: formArtist.email_artist,
        password: formArtist.passwordArtist,
        meta: {
          role: "artista",
          stage_name: formArtist.stage_name,
          city: formArtist.cityArtist,
          duty: formArtist.dutySelect,
          email_artist: formArtist.email_artist,
          bio: formArtist.bio
        },
      }),
    );

    if (signUpThunk.rejected.match(action)) {

      setEmailEx({
        active: true,
        message: action.payload?.message ?? action.error.message
      });
      return;
    }
    if(signUpThunk.fulfilled.match(action)){

      setConfirmation({active:true,message: 'Registrazione come Artista avvenuta con successo! Conferma la registrazione cliccando il link inviato via email.'})
    }
    
  }

  async function handleVenueSignUp(formVenue) {
    const action = await dispatch(
      signUpThunk({
        email: formVenue.email_venue,
        password: formVenue.passwordVenue,
        meta: {
          role: "locale",
          venue_name: formVenue.venue_name,
          city: formVenue.cityVenue,
          duty: formVenue.dutySelect,
          email_venue: formVenue.email_venue,
          bio: formVenue.bio
        },
      }),
    );

    if (signUpThunk.rejected.match(action)) {
      setEmailEx({error: true, message: action.payload?.message ?? action.error?.message});

      return;
    }

    if(signUpThunk.fulfilled.match(action)){

      setConfirmation({active:true,message: 'Registrazione come Locale avvenuta con successo! Conferma la registrazione cliccando il link inviato via email.'})
    }
    
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
          emailEx={emailEx}
          setEmailEx={setEmailEx}
          confirmation= {confirmation}
          setConfirmation= {setConfirmation}
          setView={setView}
        />
      )}
      {view === "locale" && (
        <FormRegistazioneLocale
          handleVenueSignUp={handleVenueSignUp}
          comeBack={comeBack}
          duty={duty}
          emailEx={emailEx}
          setEmailEx={setEmailEx}
          confirmation= {confirmation}
          setConfirmation= {setConfirmation}
          setView={setView}
        />
      )}
    </>
  );
}
