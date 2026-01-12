import { faker } from '@faker-js/faker'
import { isProd } from '../../env.ts'
import { dbConnection } from './connection.ts'
import { Item, type ItemDocument } from './models.ts'

const SEED_ITEM_NUMBER = 5

async function createSeedItems(number: number): Promise<ItemDocument[]> {
  const seedItems: ItemDocument[] = []

  for (let i = 0; i < number; i++) {
    const seedItem = await Item.create({
      name: faker.commerce.product(),
    })
    seedItems.push(seedItem)
  }

  return seedItems
}

const seed = async () => {
  if (isProd()) {
    console.error('🚨 Cannot seed database in production')
    process.exit(1)
  }

  try {
    await dbConnection()

    console.log('🧼 Clearing existing data...')
    await Item.deleteMany({})

    console.log('➕ Inserting seed data...')
    const seedItems = await createSeedItems(SEED_ITEM_NUMBER)
    console.log('✅ Seed complete:', seedItems)
    process.exit(0)
  } catch (error) {
    console.error('🚨 Seed failed:', error)
    process.exit(1)
  }
}

seed()
