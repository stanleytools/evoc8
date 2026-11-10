/**
 * Simulated inventory API, owned by another team.
 * Treat this as a real server you cannot change. The payload below is
 * exactly what production returns.
 */
export const rawInventoryResponse: unknown = [
  {
    sku: 'KB-100',
    name: 'Mechanical keyboard',
    price: '89.00',
    stock: 14,
    discontinuedAt: null,
    tags: ['peripherals', 'best seller'],
  },
  {
    sku: 'MS-220',
    name: 'Wireless mouse',
    price: '34.50',
    stock: 0,
    discontinuedAt: '2026-03-01T00:00:00Z',
    tags: ['peripherals'],
  },
  {
    sku: 'HB-310',
    name: 'USB-C hub',
    price: '49.99',
    stock: 7,
    discontinuedAt: null,
  },
];

const LATENCY_MS = 400;

export function getInventoryFeed(): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(rawInventoryResponse), LATENCY_MS);
  });
}
