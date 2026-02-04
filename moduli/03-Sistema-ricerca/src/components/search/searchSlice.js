import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import { searchArtists,searchVenue } from "../../services/searchService";




const initialState = {
filters: {city:'',duty:'',q:''},
results: [],
status: 'idle',
error: null
}


export const searchThunk = createAsyncThunk(
    'search',
    async ({role,filters}, { rejectWithValue}) => {
        const { city, duty, q } = filters;
       const res = 
       role === 'locale' ? await searchArtists({q,city,duty})
       : await searchVenue({q,city,duty});

       const {data, error} = res;
       if (error){
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.status
        })
       }
       return data
    }
)



 const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers: {
        setFilter(state,action){
            const { key, value} = action.payload;
            state.filters[key] = value;
        },
        clearResult(state){
            state.results = [],
            state.status = 'idle',
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder.
        addCase(searchThunk.fulfilled, (state,action) => {
            state.results = action.payload,
            state.status = 'fulfilled',
            state.error = null
        })
        .addCase(searchThunk.rejected, (state,action) => {
            state.status = 'failed',
            state.error = action.payload ?? { message: action.error.message}
        })
        .addCase(searchThunk.pending, (state) => {
            state.status = 'loading',
            state.error = null
        })
    }
 })

 export const {setFilter, clearResult} = searchSlice.actions;
 export default searchSlice.reducer