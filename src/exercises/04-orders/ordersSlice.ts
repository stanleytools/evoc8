import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getOrders, type Order } from './ordersApi';

interface OrdersState {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (options: { simulateOutage: boolean }) => {
    return await getOrders(options);
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
