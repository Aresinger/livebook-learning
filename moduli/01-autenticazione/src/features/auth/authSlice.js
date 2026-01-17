import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../../services/authService";
import { readProfile, createProfile } from "../../services/profileService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await signIn(email, password);
    if (error) return rejectWithValue({
  message: error.message,
  code: error.code,
  status: error.status,
});


    const user = data.session.user;
    const role = user.user_metadata?.role;

    if (!role) return rejectWithValue({
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

    if (!profile) {
      const { data: created, error: createErr } = await createProfile(
        user.id,
        role
      );
      if (createErr) return rejectWithValue({
  message: createErr.message,
  code: createErr.code,
  status: createErr.status,
});

      return { user, role, profile: created };
    }
    console.log({user, role, profile})
    return { user, role, profile };
    
  }
);

const initialState = {
  user: null,
  role: null,
  profile: null,
  status: "idle",
  error: null,
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.profile = action.payload.profile;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message };

      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
