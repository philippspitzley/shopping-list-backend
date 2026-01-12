import type { Request, Response } from 'express'
import { Item } from '../db/models.ts'

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    const existingItem = await Item.findOne({ name })

    if (existingItem) {
      return res.status(409).json({ message: 'Item already in items' })
    }

    const createdItem = await Item.create({ name })

    res.status(201).json({
      message: 'Item created successfully',
      item: createdItem,
    })
  } catch (error) {
    console.error('Create item error:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
}

export const getItems = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find().sort('created_at')

    res.json({
      items: items,
    })
  } catch (error) {
    console.error('Get items error:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
}

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await Item.findById(id)

    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json({
      item: item,
    })
  } catch (error) {
    console.error('Get item error:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
}

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    console.log(req.body)

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
    })

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json({
      item: updatedItem,
    })
  } catch (error) {
    console.error('Update item error:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
}

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deletedItem = await Item.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Get item error:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
}
