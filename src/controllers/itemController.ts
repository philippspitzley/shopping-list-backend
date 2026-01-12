import type { Request, Response } from 'express'
import { Item } from '../db/models.ts'
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../middleware/errorHandler.ts'

export const createItem = async (req: Request, res: Response) => {
  const { name } = req.body

  const existingItem = await Item.findOne({ name })

  if (existingItem) {
    throw new ConflictError('Item is already in items')
    // return res.status(409).json({ message: 'Item already in items' })
  }

  const createdItem = await Item.create({ name })

  res.status(201).json({
    message: 'Item created successfully',
    item: createdItem,
  })
}

export const getItems = async (_req: Request, res: Response) => {
  const items = await Item.find().sort('created_at')

  res.json({
    items: items,
  })
}

export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params

  const item = await Item.findById(id)

  if (!item) {
    throw new NotFoundError('Item not found')
  }

  res.json({
    item: item,
  })
}

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params

  if (Object.keys(req.body).length === 0) {
    throw new ValidationError('Empty request body', [
      {
        path: ['body'],
        field: '',
        message:
          'Invalid input: expected json with at least one updatable field, received empty object',
      },
    ])
  }

  const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
    new: true,
  })

  if (!updatedItem) {
    throw new NotFoundError('Item not found')
  }

  res.json({
    item: updatedItem,
  })
}

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params

  const deletedItem = await Item.findByIdAndDelete(id)

  if (!deletedItem) {
    throw new NotFoundError('Item not found')
  }

  res.status(204).send()
}
