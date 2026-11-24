import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatPrice } from '../../data/products';
import {
  cartEmptied,
  itemRemoved,
  quantityChanged,
  selectCartItems,
  selectCartTotal,
} from './cartSlice';

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return <p className="muted">Your cart is empty.</p>;
  }

  return (
    <div>
      <ul className="list">
        {items.map((item) => (
          <li key={item.id} className="list-row">
            <span>{item.name}</span>
            <span className="stepper">
              <button
                type="button"
                aria-label={`Decrease ${item.name}`}
                onClick={() =>
                  dispatch(quantityChanged({ id: item.id, quantity: item.quantity - 1 }))
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase ${item.name}`}
                onClick={() =>
                  dispatch(quantityChanged({ id: item.id, quantity: item.quantity + 1 }))
                }
              >
                +
              </button>
            </span>
            <span className="muted">{formatPrice(item.price * item.quantity)}</span>
            <button type="button" onClick={() => dispatch(itemRemoved(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="row-between">
        <strong>Total: {formatPrice(total)}</strong>
        <button type="button" className="secondary" onClick={() => dispatch(cartEmptied())}>
          Empty cart
        </button>
      </div>
    </div>
  );
}
