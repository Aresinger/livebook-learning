import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readVenue , updateVenue} from "./venueService";


const initialState = {
    venue: null,
    status: 'idle',
    error: null
}

export const fetchMyVenueThunk = createAsyncThunk(
    "artist/fetchVenue",
    async ( { id }, { rejectWithValue }) =>{
         const { data: venue, error: errReadVenue } = await readVenue(id);
              if (errReadVenue && errReadVenue.code !== "PGRST116") {
                console.log(errReadVenue)
                return rejectWithValue({
                  message: errReadVenue.message,
                  code: errReadVenue.code,
                  status: errReadVenue.status,
                });
              }
              return venue
    }

)

export const updateMyVenueThunk = createAsyncThunk(
    "artist/updateFetchVenue",
    async({ id, payload} ,{ rejectWithValue }) => {
        const { data, error } = await updateVenue(id,payload)
        if(error){
            return rejectWithValue({
                message:error.message,
                code: error.code,
                status: error.status
            })
        }

        return data
    }
)

const venueSlice = createSlice({
    name:"venueFetch",
    initialState,
    reducers:{
        cleanData(state){
            state.venue = null;
            state.error = null;
            state.status = 'ClearCompleted';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMyVenueThunk.pending, (state) =>{
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchMyVenueThunk.fulfilled, (state,action) =>{
            state.status = "completed";
            state.error = null;
            state.venue = action.payload
        })
         .addCase(fetchMyVenueThunk.rejected, (state,action) =>{
            state.status = "rejected";
            state.error = action.payload || {message: action.error.message};
        })
          .addCase(updateMyVenueThunk.rejected, (state,action) =>{
            state.status = "rejected";
            state.error = action.payload || {message: action.error.message};
        })
        .addCase(updateMyVenueThunk.fulfilled, (state,action) =>{
            state.status = "completed";
            state.error = null;
            state.venue = action.payload
        })
         .addCase(updateMyVenueThunk.pending, (state) =>{
            state.status = "loading";
            state.error = null;
        })
        
    }
})

export const {cleanData} = venueSlice.actions;
export default venueSlice.reducer