import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getInventoryFeed } from './inventoryApi';
import { InventoryFeedSchema, type InventoryItem } from './inventorySchema';

export interface FeedIssue {
  path: string;
  message: string;
}

interface InventoryState {
  items: InventoryItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  issues: FeedIssue[];
}

const initialState: InventoryState = {
  items: [],
  status: 'idle',
  issues: [],
};

export const fetchInventory = createAsyncThunk<
  InventoryItem[],
  void,
  { rejectValue: FeedIssue[] }
>('inventory/fetchInventory', async (_, { rejectWithValue }) => {
  const response = await getInventoryFeed();
  const result = InventoryFeedSchema.safeParse(response);

  if (!result.success) {
    return rejectWithValue(
      result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  return result.data;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
        state.issues = [];
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.issues = action.payload ?? [
          { path: '', message: action.error.message ?? 'Unknown error' },
        ];
      });
  },
});

export const selectInventory = (state: RootState) => state.inventory;

export default inventorySlice.reducer;
