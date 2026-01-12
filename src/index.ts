import env, { isTest } from '../env.ts'
import { dbConnection } from './db/connection.ts'
import app from './server.ts'

console.log('🚀 Starting Server...')
if (!isTest()) {
  await dbConnection()
}

app.listen(env.PORT, async () => {
  console.log(`✅ Server is running on http://localhost:${env.PORT}`)
})
