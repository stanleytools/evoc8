import { useAppSelector } from '../../app/hooks';
import { formatPrice, products } from '../../data/products';
import { addToCart, selectQuickCartCount, selectQuickCartLines } from './quickCartSlice';

const featured = products.slice(0, 4);

export function AddToCart() {
  const count = useAppSelector(selectQuickCartCount);
  const lines = useAppSelector(selectQuickCartLines);

  return (
    <div>
      <div className="row-between">
        <h3>Featured products</h3>
        <span className="badge" aria-label="Cart count">
          Cart: {count}
        </span>
      </div>

      <ul className="list">
        {featured.map((product) => (
          <li key={product.id} className="list-row">
            <span>{product.name}</span>
            <span className="muted">{formatPrice(product.price)}</span>
            <button type="button" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>

      <h3>In your cart</h3>
      {lines.length === 0 ? (
        <p className="muted">Nothing yet.</p>
      ) : (
        <ul className="list">
          {lines.map((line) => (
            <li key={line.id} className="list-row">
              <span>{line.name}</span>
              <span className="muted">Qty {line.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
