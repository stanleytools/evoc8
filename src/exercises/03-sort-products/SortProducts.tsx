import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatPrice } from '../../data/products';
import { sortOrderChanged, type SortOrder } from './catalogSlice';
import { selectSortedProducts, selectSortOrder } from './selectors';

const options: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function SortProducts() {
  const dispatch = useAppDispatch();
  const sortOrder = useAppSelector(selectSortOrder);
  const sortedProducts = useAppSelector(selectSortedProducts);

  return (
    <div>
      <div className="button-group" role="group" aria-label="Sort order">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === sortOrder ? 'active' : 'secondary'}
            onClick={() => dispatch(sortOrderChanged(option.value))}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ol className="list">
        {sortedProducts.map((product) => (
          <li key={product.id} className="list-row">
            <span>{product.name}</span>
            <span className="muted">{formatPrice(product.price)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
