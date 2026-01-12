import { remember } from '@epic-web/remember'
import mongose, { type Mongoose } from 'mongoose'
import env, { isProd } from '../../env.ts'

export const connectDB = async () => {
  console.log('🗄️  Connecting with database...')
  const conn = await mongose.connect(env.DATABASE_URL)
  console.log(
    `🗄️  MongoDB connected with: ${conn.connection.host}:${conn.connection.port}`,
  )
  console.log(`🗄️  Database: ${conn.connection.name}`)

  return conn
}

// prevents reconnecting to db after each hot reaload in development
export async function dbConnection(): Promise<Mongoose> {
  if (isProd()) {
    return await connectDB()
  }

  return await remember('db', () => connectDB())
}
