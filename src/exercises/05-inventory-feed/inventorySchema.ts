import { z } from 'zod';

export const InventoryItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number().int().positive(),
  discontinuedAt: z.string().optional(),
  tags: z.array(z.string()),
});

export const InventoryFeedSchema = z.array(InventoryItemSchema);

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
