import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readArtist, updateArtist } from "../artist/artistService";
import { readVenue, updateVenue } from "../venue/venueService";

// export const loadMyProfileThunk = createAsyncThunk(
//   "profile/loadMyProfile",
//   async ({ userId, role }, { rejectWithValue }) => {
//     try {
//       if (role === "artista") {
//         const { data, error } = await readArtist(userId);
//         if (error) throw error;
//         return { role, data };
//       }

//       if (role === "locale") {
//         const { data, error } = await readVenue(userId);
//         if (error) throw error;
//         return { role, data };
//       }

//       throw new Error("ROLE_NOT_SUPPORTED");
//     } catch (err) {
//       return rejectWithValue({
//         message: err.message,
//         code: err.code ?? "PROFILE_LOAD_ERROR",
//       });
//     }
//   }
// );

export const updateMyProfileThunk = createAsyncThunk(
  "profile/updateMyProfile",
  async ({ userId, role, payload }, { rejectWithValue }) => {
    try {
      if (role === "artista") {
        const { data, error } = await updateArtist(userId, payload);
        if (error) throw error;
        return data;
      }

      if (role === "locale") {
        const { data, error } = await updateVenue(userId, payload);
        if (error) throw error;
        return data;
      }

      throw new Error("ROLE_NOT_SUPPORTED");
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code ?? "PROFILE_UPDATE_ERROR",
      });
    }
  }
);

const initialState = {
  entity: null,
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.entity = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD
    //   .addCase(loadMyProfileThunk.pending, (state) => {
    //     state.status = "loading";
    //     state.error = null;
    //   })
    //   .addCase(loadMyProfileThunk.fulfilled, (state, action) => {
    //     state.status = "ready";
    //     state.entity = action.payload.data;
    //   })
    //   .addCase(loadMyProfileThunk.rejected, (state, action) => {
    //     state.status = "error";
    //     state.error = action.payload;
    //   })

      // UPDATE
      .addCase(updateMyProfileThunk.pending, (state) => {
        state.status = "saving";
      })
      .addCase(updateMyProfileThunk.fulfilled, (state, action) => {
        state.status = "ready";
        state.entity = action.payload;
      })
      .addCase(updateMyProfileThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
