import { products, type Product } from '../../data/products';

/**
 * Simulated search API. Treat this as a real server you cannot change.
 *
 * Short queries match more of the catalog, so the server takes longer
 * to answer them. That behavior is by design.
 */
function latencyFor(query: string): number {
  return Math.max(200, 1700 - query.length * 500);
}

export function searchCatalog(query: string): Promise<Product[]> {
  const term = query.trim().toLowerCase();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter((product) => product.name.toLowerCase().includes(term)));
    }, latencyFor(term));
  });
}
