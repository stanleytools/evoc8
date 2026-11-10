export interface Product {
  id: string;
  name: string;
  price: number;
}

export const products: Product[] = [
  { id: 'p-01', name: 'Mechanical keyboard', price: 89 },
  { id: 'p-02', name: 'Wireless mouse', price: 34.5 },
  { id: 'p-03', name: 'USB-C hub', price: 49.99 },
  { id: 'p-04', name: 'Laptop stand', price: 42 },
  { id: 'p-05', name: 'Monitor arm', price: 119 },
  { id: 'p-06', name: 'USB microphone', price: 74.25 },
  { id: 'p-07', name: 'Bluetooth speaker', price: 58 },
  { id: 'p-08', name: 'Mouse pad', price: 12.99 },
  { id: 'p-09', name: 'Webcam', price: 64 },
  { id: 'p-10', name: 'Desk lamp', price: 27.5 },
];

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
