import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatPrice } from '../../data/products';
import { fetchOrders, selectOrders, selectOrdersError, selectOrdersStatus } from './ordersSlice';

export function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const status = useAppSelector(selectOrdersStatus);
  const error = useAppSelector(selectOrdersError);
  const [simulateOutage, setSimulateOutage] = useState(false);

  return (
    <div>
      <div className="toolbar">
        <button
          type="button"
          disabled={status === 'loading'}
          onClick={() => dispatch(fetchOrders({ simulateOutage }))}
        >
          Load orders
        </button>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={simulateOutage}
            onChange={(event) => setSimulateOutage(event.target.checked)}
          />
          Simulate API outage
        </label>
      </div>

      {status === 'idle' && <p className="muted">No orders loaded yet.</p>}

      {status === 'loading' && <p className="loading">Loading orders...</p>}

      {status === 'failed' && (
        <p className="error" role="alert">
          Could not load orders: {error}
        </p>
      )}

      {status === 'succeeded' && (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th className="numeric">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td className="numeric">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
