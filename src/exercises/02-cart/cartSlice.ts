import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  currency: 'USD';
}

const initialState: CartState = {
  items: [
    { id: 'p-01', name: 'Mechanical keyboard', price: 89, quantity: 1 },
    { id: 'p-03', name: 'USB-C hub', price: 49.99, quantity: 2 },
    { id: 'p-08', name: 'Mouse pad', price: 12.99, quantity: 1 },
  ],
  currency: 'USD',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    quantityChanged(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    itemRemoved(state, action: PayloadAction<string>) {
      state.items.filter((item) => item.id !== action.payload);
    },
    cartEmptied(state) {
      state = { ...state, items: [] };
    },
  },
});

export const { quantityChanged, itemRemoved, cartEmptied } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
