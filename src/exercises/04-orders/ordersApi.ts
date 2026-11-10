/**
 * Simulated orders API. Treat this as a real server you cannot change.
 */
export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
}

const orders: Order[] = [
  { id: 'SO-1042', customer: 'Northwind Traders', total: 412.5, status: 'shipped' },
  { id: 'SO-1043', customer: 'Contoso Ltd', total: 89, status: 'processing' },
  { id: 'SO-1044', customer: 'Fabrikam Inc', total: 1240.75, status: 'delivered' },
  { id: 'SO-1045', customer: 'Adventure Works', total: 58, status: 'processing' },
];

const LATENCY_MS = 700;

export function getOrders(options: { simulateOutage: boolean }): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (options.simulateOutage) {
        reject(new Error('503 Service Unavailable'));
      } else {
        resolve(orders);
      }
    }, LATENCY_MS);
  });
}
