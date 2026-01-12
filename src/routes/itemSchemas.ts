import { z } from 'zod'

const idParam = z.string().length(24, 'ID must be exactly 24 characters long.')
const nameParam = z
  .string()
  .min(1, 'Item name is required')
  .max(100, 'Name too long')
const boughtParam = z.boolean()

const idParamSchema = z.object({
  id: idParam,
})

const baseItemSchema = z.object({
  name: nameParam,
  bought: boughtParam.default(false),
})

const createItemSchema = baseItemSchema.pick({
  name: true,
})

const updateItemSchema = z
  .object({
    name: nameParam,
    bought: boughtParam,
  })
  .partial()
  .strict()

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
  create: createItemSchema,
  update: updateItemSchema,
  response: itemResponseSchema,
}
