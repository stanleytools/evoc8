import type { ComponentType } from 'react';
import { AddToCart } from '../exercises/01-add-to-cart/AddToCart';
import { Cart } from '../exercises/02-cart/Cart';
import { SortProducts } from '../exercises/03-sort-products/SortProducts';
import { Orders } from '../exercises/04-orders/Orders';
import { InventoryFeed } from '../exercises/05-inventory-feed/InventoryFeed';
import { Search } from '../exercises/06-search/Search';
import { click, findButtons, settle, sleep, textOf, typeInto, waitFor } from './dom';
import { mountFeature, type MountedFeature } from './mount';

/**
 * Automated checks. Not part of any exercise, and nothing here needs to change.
 *
 * Each check uses a feature the way its ticket describes (click, load, type)
 * and reports whether the expected behavior happened. A check passes for any
 * fix that makes the feature behave correctly.
 */
export type Check = () => Promise<boolean>;

async function withFeature(
  Feature: ComponentType,
  body: (feature: MountedFeature) => Promise<boolean>,
): Promise<boolean> {
  const feature = await mountFeature(Feature);
  try {
    return await body(feature);
  } catch {
    return false;
  } finally {
    feature.unmount();
  }
}

const addToCart: Check = () =>
  withFeature(AddToCart, async ({ host }) => {
    const buttons = findButtons(host, 'Add to cart');
    click(buttons[0]);
    click(buttons[0]);
    click(buttons[1]);
    await settle();
    const text = textOf(host);
    return text.includes('Cart: 3') && text.includes('Qty 2') && text.includes('Qty 1');
  });

const cart: Check = async () => {
  const removes = withFeature(Cart, async ({ host }) => {
    click(findButtons(host, 'Remove')[0]);
    await settle();
    const text = textOf(host);
    return (
      !text.includes('Mechanical keyboard') &&
      text.includes('USB-C hub') &&
      text.includes('Total: $112.97')
    );
  });

  const empties = withFeature(Cart, async ({ host }) => {
    click(findButtons(host, 'Empty cart')[0]);
    await settle();
    return textOf(host).includes('Your cart is empty.');
  });

  const [removed, emptied] = await Promise.all([removes, empties]);
  return removed && emptied;
};

const sortProducts: Check = () =>
  withFeature(SortProducts, async ({ host, crashed }) => {
    const names = () =>
      Array.from(host.querySelectorAll('li')).map((item) => item.firstElementChild?.textContent);
    const original = names().join('|');

    click(findButtons(host, 'Price: low to high')[0]);
    await settle();
    if (crashed()) return false;
    const ascending = names();
    if (ascending[0] !== 'Wireless mouse' || ascending[5] !== 'Monitor arm') return false;

    click(findButtons(host, 'Price: high to low')[0]);
    await settle();
    if (crashed() || names()[0] !== 'Monitor arm') return false;

    click(findButtons(host, 'Featured')[0]);
    await settle();
    return !crashed() && names().join('|') === original;
  });

const orders: Check = () =>
  withFeature(Orders, async ({ host }) => {
    const rows = () => host.querySelectorAll('tbody tr').length;
    const alertText = () => host.querySelector('[role="alert"]')?.textContent ?? '';
    const load = () => click(findButtons(host, 'Load orders')[0]);
    const toggleOutage = () => click(host.querySelector('input[type="checkbox"]'));

    load();
    if (!(await waitFor(() => rows() === 4, 3000))) return false;
    if (textOf(host).includes('Loading orders...')) return false;

    toggleOutage();
    await settle();
    load();
    if (!(await waitFor(() => alertText().includes('503 Service Unavailable'), 3000))) return false;
    if (host.querySelector('table')) return false;

    toggleOutage();
    await settle();
    load();
    return waitFor(() => rows() === 4 && alertText() === '', 3000);
  });

const inventoryFeed: Check = () =>
  withFeature(InventoryFeed, async ({ host }) => {
    const rows = () => Array.from(host.querySelectorAll('tbody tr')).map((row) => textOf(row));

    click(findButtons(host, 'Load inventory')[0]);
    if (!(await waitFor(() => rows().length === 3, 2500))) return false;
    if (host.querySelector('[role="alert"]')) return false;

    const [keyboard, mouse, hub] = rows();
    return (
      keyboard.includes('$89.00') &&
      keyboard.includes('14 in stock') &&
      mouse.includes('Out of stock') &&
      mouse.includes('Discontinued') &&
      hub.includes('$49.99') &&
      !hub.includes('Discontinued')
    );
  });

const search: Check = () =>
  withFeature(Search, async ({ host }) => {
    const input = host.querySelector('input[type="search"]');
    for (const value of ['u', 'us', 'usb']) {
      typeInto(input, value);
      await sleep(120);
    }
    await sleep(1900);

    const results = Array.from(host.querySelectorAll('li')).map((item) => textOf(item));
    return (
      results.length === 2 &&
      results.every((result) => /usb/i.test(result)) &&
      textOf(host).includes('2 results for "usb"')
    );
  });

export const checks: Record<number, Check> = {
  1: addToCart,
  2: cart,
  3: sortProducts,
  4: orders,
  5: inventoryFeed,
  6: search,
};
