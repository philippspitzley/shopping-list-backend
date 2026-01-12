import dotenv from 'dotenv'
import { z } from 'zod'

const isDevelopment = process.env.NODE_ENV === 'development'
const isTesting = process.env.NODE_ENV === 'test'
const isProduction = process.env.NODE_ENV === 'production'

if (isDevelopment) {
  dotenv.config({ path: '.env', quiet: true })
  console.log('✅ Development environments loaded')
} else if (isTesting) {
  console.log('✅ Test environments loaded')
  dotenv.config({ path: '.env.test', quiet: true })
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().positive().default(3000), // DATABASE_URL is not needed in test mode (MongoDB Memory Server provides it)

  DATABASE_URL: isTesting
    ? z.string().default('')
    : z.string().startsWith('mongodb://', 'Must be a valid mongodb URL'),

  ALLOWED_ORIGINS: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.log('🚨 Invalid env var')
  console.error(z.prettifyError(parsedEnv.error))

  process.exit(1)
}

const env: Env = parsedEnv.data

export const isProd = () => isProduction
export const isDev = () => isDevelopment
export const isTest = () => isTesting

export { env }
export default env
