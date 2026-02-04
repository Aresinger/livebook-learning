import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signIn,
  signOut,
  getSession,
  signUp,
} from "../../services/authService";

const initialState = {
  user: null,
  role: null,
  status: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await signIn(email, password);
    if (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }
    return data;
  }
);

export const signUpThunk = createAsyncThunk(
  "auth/registrazione",
  async ({ email, password, meta }, { rejectWithValue }) => {
    const { data, error } = await signUp(email, password, meta);
    if (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }

    const identities = data?.user?.identities;
    if (Array.isArray(identities) && identities.length === 0) {
      return rejectWithValue({
        message:
          "Questa email risulta già registrata. Prova ad accedere oppure recupera la password.",
        code: "EMAIL_ALREADY_REGISTERED",
        status: 409,
      });
    }

    return data;
  }
);

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { rejectWithValue }) => {
    const { data, error } = await getSession();
    if (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }

    const session = data?.session;
    if (!session) {
      return { user: null, role: null };
    }

    const user = session.user;
    const role = user.user_metadata?.role ?? null;

    return { user, role };
  }
);

export const thunkLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const { error } = await signOut();
    if (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }
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
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loggingIn";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.status = "booting";
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = "booting";
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = "ready";
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })
      .addCase(thunkLogout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(thunkLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };
      })
      .addCase(signUpThunk.fulfilled, (state) => {
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
