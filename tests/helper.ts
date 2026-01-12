import { faker } from '@faker-js/faker'
import type { Schema } from 'mongoose'
import request from 'supertest'
import type { ItemCreate } from '../src/db/models.ts'
import app from '../src/server.ts'

export async function createItem() {
  const newItem: ItemCreate = { name: faker.commerce.product() }

  const response = await request(app)
    .post('/api/items')
    .send(newItem)
    .expect('Content-Type', /json/)

  return { response, newItem }
}

export async function createItemWithEmptyBody() {
  const response = await request(app)
    .post('/api/items')
    .send({})
    .expect('Content-Type', /json/)
    .expect(400)

  return { response }
}

export async function createItemWithInvalidProperty() {
  const invalidItem = { animal: faker.animal.crocodilia }

  const response = await request(app)
    .post('/api/items')
    .send(invalidItem)
    .expect('Content-Type', /json/)
    .expect(400)

  return { response }
}

export async function createItemWithInvalidBody() {
  const invalidBody = 'i am text'

  const response = await request(app)
    .post('/api/items')
    .send(invalidBody)
    .expect('Content-Type', /json/)
    .expect(400)

  return { response }
}

export async function createManyItems(itemQuantity: number) {
  const items: ItemCreate[] = []

  for (let i = 0; i < itemQuantity; i++) {
    const { response, newItem } = await createItem()

    // rerun if item name already exists
    if (response.status === 409) {
      i--
      continue
    }

    items.push(newItem)
  }

  return { items }
}

export async function createManyItemsWithEmptyBody(itemQuantity: number) {
  for (let i = 0; i < itemQuantity; i++) {
    await createItemWithEmptyBody()
  }
}

export async function createManyItemsWithWrongBody(itemQuantity: number) {
  for (let i = 0; i < itemQuantity; i++) {
    await createItemWithInvalidProperty()
  }
}

export async function getItems() {
  const response = await request(app)
    .get('/api/items')
    .expect('Content-Type', /json/)

  return { response }
}

export async function getItemByID(id: string | Schema.Types.ObjectId) {
  const response = await request(app)
    .get(`/api/items/${id}`)
    .expect('Content-Type', /json/)

  return { response }
}

export async function updateItem(
  id: string | Schema.Types.ObjectId,
  item: object | string,
) {
  const response = await request(app)
    .patch(`/api/items/${id}`)
    .send(item)
    .expect('Content-Type', /json/)

  return { response }
}

export async function deleteItemByID(id: string | Schema.Types.ObjectId) {
  const response = await request(app).delete(`/api/items/${id}`)

  return { response }
}
