import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readArtist ,updateArtist} from "./artistService";


const initialState = {
    artist: null,
    status: 'idle',
    error: null
}

export const fetchMyArtistThunk = createAsyncThunk(
    "artist/fetchArtist",
    async ( { id }, { rejectWithValue }) =>{
         const { data: artist, error: errReadArtist } = await readArtist(id);
              if (errReadArtist && errReadArtist.code !== "PGRST116") {
                console.log(errReadArtist)
                return rejectWithValue({
                  message: errReadArtist.message,
                  code: errReadArtist.code,
                  status: errReadArtist.status,
                });
              }
              return artist
    }

)

export const updateMyArtistThunk = createAsyncThunk(
    "artist/updateFetchArtist",
    async({ id, payload} ,{ rejectWithValue }) => {
        const { data, error } = await updateArtist(id,payload)
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

const artistSlice = createSlice({
    name:"artistFetch",
    initialState,
    reducers:{
        cleanData(state){
            state.artist = null;
            state.error = null;
            state.status = 'ClearCompleted';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMyArtistThunk.pending, (state) =>{
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchMyArtistThunk.fulfilled, (state,action) =>{
            state.status = "completed";
            state.error = null;
            state.artist = action.payload
        })
         .addCase(fetchMyArtistThunk.rejected, (state,action) =>{
            state.status = "rejected";
            state.error = action.payload || {message: action.error.message};
        })
        .addCase(updateMyArtistThunk.pending, (state) =>{
            state.status = "updating";
            state.error = null;
        })
         .addCase(updateMyArtistThunk.fulfilled, (state,action) =>{
            state.status = "completed";
            state.error = null;
            state.artist = action.payload
        })
         .addCase(updateMyArtistThunk.rejected, (state,action) =>{
            state.status = "failed";
            state.error = action.payload ?? { message: action.error.message };
        })
        
    }
})

export const {cleanData} = artistSlice.actions;
export default artistSlice.reducer