import type { ComponentType } from 'react';
import type { RootState } from '../app/store';
import { AddToCart } from './01-add-to-cart/AddToCart';
import { Cart } from './02-cart/Cart';
import { SortProducts } from './03-sort-products/SortProducts';
import { Orders } from './04-orders/Orders';
import { InventoryFeed } from './05-inventory-feed/InventoryFeed';
import { Search } from './06-search/Search';

export interface Exercise {
  id: number;
  title: string;
  folder: string;
  sliceKey: keyof RootState;
  steps: string[];
  expected: string;
  actual: string;
  note?: string;
  Component: ComponentType;
}

export const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Add to cart does nothing',
    folder: 'src/exercises/01-add-to-cart',
    sliceKey: 'quickCart',
    steps: ['Click "Add to cart" on any product.'],
    expected:
      'The cart count goes up by 1 on every click and the product appears under "In your cart" with its quantity.',
    actual: 'Nothing happens. There is no error in the console.',
    Component: AddToCart,
  },
  {
    id: 2,
    title: 'Cart items cannot be removed',
    folder: 'src/exercises/02-cart',
    sliceKey: 'cart',
    steps: ['Click "Remove" next to any item.', 'Click "Empty cart".'],
    expected:
      '"Remove" deletes that one line and the total updates. "Empty cart" removes every line and shows "Your cart is empty."',
    actual: 'Neither button changes anything. The quantity buttons work fine.',
    Component: Cart,
  },
  {
    id: 3,
    title: 'Sorting by price crashes the page',
    folder: 'src/exercises/03-sort-products',
    sliceKey: 'catalog',
    steps: ['Click "Price: low to high".'],
    expected:
      'The list re-orders by price. "Featured" brings back the original order (keyboard first, USB microphone last).',
    actual: 'The feature crashes with an error.',
    Component: SortProducts,
  },
  {
    id: 4,
    title: 'Orders never finish loading',
    folder: 'src/exercises/04-orders',
    sliceKey: 'orders',
    steps: [
      'Click "Load orders" and wait a second.',
      'Tick "Simulate API outage" and click "Load orders" again.',
    ],
    expected:
      'Step 1 shows a table of four orders. Step 2 hides the table and shows "Could not load orders" with the reason from the API. Unticking the box and loading again recovers.',
    actual: '"Loading orders..." stays on screen forever in both cases.',
    Component: Orders,
  },
  {
    id: 5,
    title: 'Inventory feed is rejected',
    folder: 'src/exercises/05-inventory-feed',
    sliceKey: 'inventory',
    steps: ['Click "Load inventory".'],
    expected:
      'Three products are listed with a price, availability ("Out of stock" when stock is 0), a "Discontinued" label where it applies, and tags (blank when there are none).',
    actual: 'The feed is rejected with a list of validation issues.',
    note: 'The inventory API belongs to another team. The response under "Raw API response" is correct and will not change. Keep validating the feed.',
    Component: InventoryFeed,
  },
  {
    id: 6,
    title: 'Search shows results for the wrong query',
    folder: 'src/exercises/06-search',
    sliceKey: 'search',
    steps: ['Type "usb" at normal typing speed.', 'Wait two seconds.'],
    expected: 'Only the two products with "usb" in the name are listed.',
    actual:
      'The box says "usb" but the list settles on five products, including some without "usb" in the name.',
    note: 'The search API is slower for short queries. That is by design and cannot change.',
    Component: Search,
  },
];
