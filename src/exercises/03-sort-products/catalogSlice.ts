import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { products, type Product } from '../../data/products';

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

interface CatalogState {
  items: Product[];
  sortOrder: SortOrder;
}

const initialState: CatalogState = {
  items: products.slice(0, 6),
  sortOrder: 'featured',
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    sortOrderChanged(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
  },
});

export const { sortOrderChanged } = catalogSlice.actions;

export default catalogSlice.reducer;
