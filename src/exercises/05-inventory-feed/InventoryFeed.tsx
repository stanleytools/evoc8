import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatPrice } from '../../data/products';
import { rawInventoryResponse } from './inventoryApi';
import { fetchInventory, selectInventory } from './inventorySlice';

export function InventoryFeed() {
  const dispatch = useAppDispatch();
  const { items, status, issues } = useAppSelector(selectInventory);

  return (
    <div>
      <div className="toolbar">
        <button
          type="button"
          disabled={status === 'loading'}
          onClick={() => dispatch(fetchInventory())}
        >
          Load inventory
        </button>
      </div>

      {status === 'idle' && <p className="muted">Inventory not loaded yet.</p>}

      {status === 'loading' && <p className="loading">Loading inventory...</p>}

      {status === 'failed' && (
        <div className="error" role="alert">
          <strong>Feed rejected: {issues.length} validation issues</strong>
          <ul>
            {issues.map((issue, index) => (
              <li key={index}>
                <code>{issue.path}</code> {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'succeeded' && (
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th className="numeric">Price</th>
              <th>Availability</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>
                  {item.name}
                  {item.discontinuedAt && <span className="pill">Discontinued</span>}
                </td>
                <td className="numeric">{formatPrice(item.price)}</td>
                <td>{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</td>
                <td>{item.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <details>
        <summary>Raw API response</summary>
        <pre>{JSON.stringify(rawInventoryResponse, null, 2)}</pre>
      </details>
    </div>
  );
}
