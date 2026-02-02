import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import artistReducer from "../features/artist/artistSlice";
import venueReducer from "../features/venue/venueSlice";
import searchReducer from "../components/search/searchSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    artist: artistReducer,
    venue: venueReducer,
    search: searchReducer
  },
});
