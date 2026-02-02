import { useState } from "react";
import { signUp } from "./../services/authService";
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
    // const { data, error } = await signUp(
    //   formArtist.emailArtist,
    //   formArtist.passwordArtist,
    //   {
    //     role: "artista",
    //     stage_name: formArtist.stage_name,
    //     city: formArtist.cityArtist,
    //     duty: formArtist.dutySelect,
    //   }
    // );

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
        },
      }),
    );

    if (signUpThunk.rejected.match(action)) {
      // alert(action.payload?.message ?? action.error.message);
      setEmailEx({
        error: true,
        message: action.payload?.message ?? action.error.message
      });
      return;
    }

    alert(
      "Account creato! Controlla la mail e conferma. Poi torna qui e fai login.",
    );
    setView("login");
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
        },
      }),
    );

    if (signUpThunk.rejected.match(action)) {
      setEmailEx({error: true, message: action.payload?.message ?? action.error.message});

      return;
    }

    alert(
      "Account creato! Controlla la mail e conferma. Poi torna qui e fai login.",
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
          emailEx={emailEx}
          setEmailEx={setEmailEx}
        />
      )}
      {view === "locale" && (
        <FormRegistazioneLocale
          handleVenueSignUp={handleVenueSignUp}
          comeBack={comeBack}
          duty={duty}
          emailEx={emailEx}
          setEmailEx={setEmailEx}
        />
      )}
    </>
  );
}
