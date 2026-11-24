import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../data/products';
import type { RootState } from '../../app/store';

export interface QuickCartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface QuickCartState {
  lines: QuickCartLine[];
}

const initialState: QuickCartState = {
  lines: [],
};

const quickCartSlice = createSlice({
  name: 'quickCart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.lines.find((line) => line.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.lines.push({ ...action.payload, quantity: 1 });
      }
    },
  },
});

export const { addToCart } = quickCartSlice.actions;

export const selectQuickCartLines = (state: RootState) => state.quickCart.lines;

export const selectQuickCartCount = (state: RootState) =>
  state.quickCart.lines.reduce((count, line) => count + line.quantity, 0);

export default quickCartSlice.reducer;
