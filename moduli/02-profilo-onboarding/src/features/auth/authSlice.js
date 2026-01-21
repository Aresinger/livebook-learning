import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signIn,
  signOut,
  getSession,
  signUp,
} from "../../services/authService";
import { readProfile, createProfile } from "../../services/profileService";
import { readArtist, createArtist } from "../artist/artistService";
import { readVenue, createVenue } from "../venue/venueService";

const initialState = {
  user: null,
  role: null,
  profile: null,
  status: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await signIn(email, password);
    if (error)
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });

    return true;
  }
);
export const signUpThunk = createAsyncThunk(
  "auth/Registrazione",
  async ({ email, password, meta }, { rejectWithValue }) => {
    const { data, error } = await signUp(email, password, meta);
    if (error)
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
      return true
  }
);

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (__, { rejectWithValue }) => {
    const { data, error } = await getSession();
    if (error) {
      console.log(error)
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      }); 
    }
    const session = data?.session;
    console.log(session)
    if (!session) {
      return { user: null, role: null, profile: null };
    }
    const user = session.user;
    const role = user.user_metadata?.role;
    const email = user.email;
    if (!role)
      return rejectWithValue({
        message: "ROLE_MISSING",
        code: "ROLE_MISSING",
        status: 400,
      });

    // read profile (gestione PGRST116)
    const { data: profile, error: readErr } = await readProfile(user.id);

    if (readErr && readErr.code !== "PGRST116") {
      return rejectWithValue({
        message: readErr.message,
        code: readErr.code,
        status: readErr.status,
      });
    }
    let ensuredProfile = profile;
    if (!ensuredProfile) {
      const { data: newProfile, error: createErr } = await createProfile(
        user.id,
        role,
        email
      );
      if (createErr) {
        console.log('createErr: '+createErr)
        return rejectWithValue({
          message: createErr.message,
          code: createErr.code,
          status: createErr.status,
        });
      }

      ensuredProfile = newProfile;
    }

    const meta = user.user_metadata || {};
    if (role === "artista") {
      const { data: artist, error: errReadArtist } = await readArtist(user.id);
      if (errReadArtist && errReadArtist.code !== "PGRST116") {
        console.log(errReadArtist)
        return rejectWithValue({
          message: errReadArtist.message,
          code: errReadArtist.code,
          status: errReadArtist.status,
        });
      }
      if (!artist) {
        const payload = {
          artist_name: meta.stage_name ?? "",
          id: user.id,
          city: meta.city ?? "",
          duties: meta.duty ? [meta.duty] : ["artista generico"],
          email_artist: meta.email_artist
        };
        const { data: artist, error: errCreateArtist } = await createArtist(
          payload
        );
        if (errCreateArtist) {
          console.log(errCreateArtist)
          return rejectWithValue({
            message: errCreateArtist.message,
            code: errCreateArtist.code,
            status: errCreateArtist.status,
          });
        }
      }
    }
    if (role === "locale") {
      const { data: locale, error: errReadVenue } = await readVenue(user.id);
      if (errReadVenue && errReadVenue.code !== "PGRST116") {
        return rejectWithValue({
          message: errReadVenue.message,
          code: errReadVenue.code,
          status: errReadVenue.status,
        });
      }
      if (!locale) {
        const payload = {
          id: user.id,
          venue_name: meta.venue_name ?? "",
          city: meta.city ?? "",
          duties: meta.duty ? [meta.duty] : ["artista generico"],
          email_venue: meta.email_venue
        };
        const { data: newVenue, error: errCreateVenue } = await createVenue(
          payload
        );
        if (errCreateVenue) {
          return rejectWithValue({
            message: errCreateVenue.message,
            code: errCreateVenue.code,
            status: errCreateVenue.status,
          });
        }
      }
    }
    return { user, role, profile: ensuredProfile };
  }
);
export const thunkLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const { error } = await signOut();
    if (error)
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.role = null;
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
    refresh(state, action) {
      state.user = action.payload.user ?? null;
      state.role = action.payload.role ?? null;
      state.profile = action.payload.profile ?? null;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN (solo auth)
      .addCase(loginThunk.pending, (state) => {
        state.status = "loggingIn";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        // Non impostare user/role/profile qui!
        // La UI viene aggiornata dal bootstrapAuth
        state.status = "booting";
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })

      // BOOTSTRAP (sincronizza store + DB)
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = "booting";
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = "ready";
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })

      // LOGOUT
      .addCase(thunkLogout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.profile = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(thunkLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message};
      })
      // SIGNUP

      .addCase(signUpThunk.fulfilled, ( state ) => {
        state.status = "signUpOk";
        state.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })
      .addCase(signUpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
  },
});

export const { logout, refresh } = authSlice.actions;
export default authSlice.reducer;
