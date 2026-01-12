import {
  createItem,
  createItemWithEmptyBody,
  createItemWithInvalidBody,
  createItemWithInvalidProperty,
  createManyItems,
  createManyItemsWithEmptyBody,
  createManyItemsWithWrongBody,
  getItems,
} from './helper.ts'

describe('Shopping List API', () => {
  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const { response, newItem } = await createItem()

      expect(response.status).toBe(201)
      expect(response.body.item).toHaveProperty('_id')
      expect(response.body.item.name).toBe(newItem.name)
    })

    it('should return 400 when empty body is provided', async () => {
      const { response } = await createItemWithEmptyBody()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Validation Error')
    })

    it('should return 400 when invalid body properties is provided', async () => {
      const { response } = await createItemWithInvalidProperty()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Validation Error')
    })

    it('should return 400 when invalid body properties is provided', async () => {
      const { response } = await createItemWithInvalidBody()

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Validation Error')
    })
  })

  describe('GET /api/items', () => {
    const itemQuantity = 5
    it('should return a list of all items stored when items are created', async () => {
      const { items } = await createManyItems(itemQuantity)
      const { response } = await getItems()

      expect(response.body).toHaveProperty('items')
      expect(response.body.items).toHaveLength(itemQuantity)

      items.forEach((item, index) => {
        expect(response.body.items[index]).toHaveProperty('_id')
        expect(response.body.items[index].name).toBe(item.name)
      })
    })

    it('should return empty list when many items with empty body are created', async () => {
      await createManyItemsWithEmptyBody(itemQuantity)
      const { response } = await getItems()

      expect(response.body).toHaveProperty('items')
      expect(response.body.items).toHaveLength(0)
    })

    it('should return empty list when many items with invalid properties are created', async () => {
      await createManyItemsWithWrongBody(itemQuantity)
      const { response } = await getItems()

      expect(response.body).toHaveProperty('items')
      expect(response.body.items).toHaveLength(0)
    })
  })
})
