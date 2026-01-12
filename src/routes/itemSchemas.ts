import { z } from 'zod'

const idParamSchema = z.object({
  id: z.string().length(24, 'ID must be exactly 24 characters long.'),
})

const baseItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Name too long'),
  bought: z.boolean().default(false),
})

const createItemSchema = baseItemSchema.pick({
  name: true,
})

const updateItemSchema = baseItemSchema.partial()

const itemResponseSchema = z.object({
  id: idParamSchema,
  name: z.string(),
  bought: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

// Exports:

export const itemSchema = {
  id: idParamSchema,
  base: baseItemSchema,
  create: createItemSchema,
  update: updateItemSchema,
  response: itemResponseSchema,
}
