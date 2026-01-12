import type { ItemDocument, ItemUpdate } from '../src/db/models.ts'
import {
  createItem,
  createItemWithEmptyBody,
  createItemWithInvalidBody,
  createItemWithInvalidProperty,
  createManyItems,
  createManyItemsWithEmptyBody,
  deleteItemByID,
  getItemByID,
  getItems,
  updateItem,
} from './helper.ts'

describe('Shopping List API', () => {
  describe('POST /api/items', () => {
    it('should return 200 with new item when new item with valid data is provided', async () => {
      const { response, newItem } = await createItem()

      expect(response.body.item).toHaveProperty('_id')
      expect(response.body.item.name).toBe(newItem.name)
    })

    it('should return 400 when empty body is provided', async () => {
      const { response } = await createItemWithEmptyBody()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })

    it('should return 400 when invalid body properties is provided', async () => {
      const { response } = await createItemWithInvalidProperty()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })

    it('should return 400 when invalid json is provided', async () => {
      const { response } = await createItemWithInvalidBody()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })
  })

  describe('GET /api/items', () => {
    const itemQuantity = 5
    it('should return 200 with a list of all items stored', async () => {
      const { items } = await createManyItems(itemQuantity)
      const { response } = await getItems()

      expect(response.body).toHaveProperty('items')
      expect(response.body.items).toHaveLength(itemQuantity)

      items.forEach((item, index) => {
        expect(response.body.items[index]).toHaveProperty('_id')
        expect(response.body.items[index].name).toBe(item.name)
      })
    })

    it('should return 200 with an empty list when no items stored', async () => {
      await createManyItemsWithEmptyBody(itemQuantity)
      const { response } = await getItems()

      expect(response.body).toHaveProperty('items')
      expect(response.body.items).toHaveLength(0)
    })
  })

  describe('GET /api/items/:id', () => {
    it('should return 200 with the requested item when valid id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const existingItem: ItemDocument = createResponse.body.item

      const { response } = await getItemByID(existingItem._id)

      expect(response.status).toBe(200)
      expect(response.body.item).toHaveProperty('_id')
      expect(response.body.item).toStrictEqual(existingItem)
    })

    it('should return 404 when nonexistant id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const nonexistantID = '111111111111111111111111'

      const { response } = await getItemByID(nonexistantID)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('NotFoundError')
    })

    it('should return 400 when invalid id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const invalidID = 'invalidID'

      const { response } = await getItemByID(invalidID)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })
  })

  describe('PATCH /api/items/:id', () => {
    it('should return 200 with the updated item when updating an existing item with valid data', async () => {
      const { response: createResponse } = await createItem()

      const existingItem: ItemDocument = createResponse.body.item
      const updateBody: ItemUpdate = { name: 'UpdatedItem' }

      const { response } = await updateItem(existingItem._id, updateBody)

      expect(response.status).toBe(200)
      expect(response.body.item).toHaveProperty('_id')
      expect(response.body.item.name).toBe(updateBody.name)
    })

    it('should return 404 when the updated item does not exist', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      // const existingItem: ItemDocument = createResponse.body.item
      const updateBody: ItemUpdate = { name: 'UpdatedItem' }

      const nonexistantID = '111111111111111111111111'

      const { response } = await updateItem(nonexistantID, updateBody)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('NotFoundError')
    })

    it('should return 400 when empty body is provided', async () => {
      const { response: createResponse } = await createItem()

      const existingItem: ItemDocument = createResponse.body.item
      const updateBody: ItemUpdate = {}

      const { response } = await updateItem(existingItem._id, updateBody)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })

    it('should return 400 when invalid body property is provided', async () => {
      const { response: createResponse } = await createItem()

      const existingItem: ItemDocument = createResponse.body.item
      const updateBody = { wrongProperty: 'Test' }

      const { response } = await updateItem(existingItem._id, updateBody)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })

    it('should return 400 when invalid json is provided', async () => {
      const { response: createResponse } = await createItem()

      const existingItem: ItemDocument = createResponse.body.item
      const updateBody = 'i am not a valid json'

      const { response } = await updateItem(existingItem._id, updateBody)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })
  })

  describe('DELETE /api/items/:id', () => {
    it('should return 204 when valid id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const existingItem: ItemDocument = createResponse.body.item

      const { response: deleteResponse } = await deleteItemByID(
        existingItem._id,
      )
      expect(deleteResponse.status).toBe(204)

      const { response: getResponse } = await getItems()
      expect(getResponse.status).toBe(200)
      expect(getResponse.body.items).toHaveLength(0)
    })

    it('should return 404 when nonexistant id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const nonexistantID = '111111111111111111111111'

      const { response } = await deleteItemByID(nonexistantID)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('NotFoundError')
    })

    it('should return 400 when invalid id is provided', async () => {
      const { response: createResponse } = await createItem()
      expect(createResponse.status).toBe(201)

      const invalidID = 'invalidID'

      const { response } = await deleteItemByID(invalidID)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error.name).toBe('ValidationError')
    })
  })
})
