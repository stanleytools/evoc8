import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../data/products';
import type { RootState } from '../../app/store';
import { searchCatalog } from './searchApi';

interface SearchState {
  query: string;
  results: Product[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: SearchState = {
  query: '',
  results: [],
  status: 'idle',
};

export const searchProducts = createAsyncThunk('search/searchProducts', async (query: string) => {
  if (query.trim() === '') {
    return [];
  }
  return await searchCatalog(query);
});

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    queryChanged(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { queryChanged } = searchSlice.actions;

export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;
