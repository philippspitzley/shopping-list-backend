import { Router } from 'express'
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from '../controllers/itemController.ts'
import {
  validateBody,
  validateParams,
} from '../middleware/validationHandler.ts'
import { itemSchema } from './itemSchemas.ts'

const router = Router()

router.get('/', getItems)
router.get('/:id', validateParams(itemSchema.id), getItemById)
router.post('/', validateBody(itemSchema.create), createItem)
router.patch(
  '/:id',
  validateParams(itemSchema.id),
  validateBody(itemSchema.update),
  updateItem,
)
router.delete('/:id', validateParams(itemSchema.id), deleteItem)

export default router
