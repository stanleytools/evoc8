import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatPrice } from '../../data/products';
import { queryChanged, searchProducts, selectSearch } from './searchSlice';

export function Search() {
  const dispatch = useAppDispatch();
  const { query, results, status } = useAppSelector(selectSearch);

  useEffect(() => {
    dispatch(searchProducts(query));
  }, [dispatch, query]);

  return (
    <div>
      <label className="field">
        Search products
        <input
          type="search"
          value={query}
          placeholder="Try: usb"
          onChange={(event) => dispatch(queryChanged(event.target.value))}
        />
      </label>

      <p className="muted" aria-live="polite">
        {status === 'loading' && 'Searching...'}
        {status === 'failed' && 'Search failed.'}
        {status === 'idle' && query !== '' && `${results.length} results for "${query}"`}
        {status === 'idle' && query === '' && 'Type to search the catalog.'}
      </p>

      <ul className="list">
        {results.map((product) => (
          <li key={product.id} className="list-row">
            <span>{product.name}</span>
            <span className="muted">{formatPrice(product.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
