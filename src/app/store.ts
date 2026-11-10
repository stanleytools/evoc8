import { configureStore } from '@reduxjs/toolkit';
import { actionLogMiddleware } from './actionLog';
import quickCartReducer from '../exercises/01-add-to-cart/quickCartSlice';
import cartReducer from '../exercises/02-cart/cartSlice';
import catalogReducer from '../exercises/03-sort-products/catalogSlice';
import ordersReducer from '../exercises/04-orders/ordersSlice';
import inventoryReducer from '../exercises/05-inventory-feed/inventorySlice';
import searchReducer from '../exercises/06-search/searchSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      quickCart: quickCartReducer,
      cart: cartReducer,
      catalog: catalogReducer,
      orders: ordersReducer,
      inventory: inventoryReducer,
      search: searchReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLogMiddleware),
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
