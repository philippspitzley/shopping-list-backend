import {
  clearTestDB,
  setupTestDB,
  teardownTestDB,
} from './mongoMemoryServer.ts'

beforeAll(async () => await setupTestDB())

afterEach(async () => await clearTestDB())

afterAll(async () => await teardownTestDB())
