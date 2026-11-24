import type { RootState } from '../../app/store';

export const selectSortOrder = (state: RootState) => state.catalog.sortOrder;

export const selectSortedProducts = (state: RootState) => {
  const { items, sortOrder } = state.catalog;

  if (sortOrder === 'featured') {
    return items;
  }

  return items.sort((a, b) => (sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price));
};
