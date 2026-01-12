import cors from 'cors'
import express from 'express'

import helmet from 'helmet'
import morgan from 'morgan'
import { env, isProd, isTest } from '../env.ts'
import { errorHandler, notFound } from './middleware/errorHandler.ts'
import itemRoutes from './routes/itemRoutes.ts'

const app = express()

// Middleware
app.use(helmet()) // Security headers
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  }),
) // CORS policy
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(morgan('dev', { skip: () => isTest() })) // Logging

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Shopping List API',
  })
})

if (!isProd()) {
  app.get('/test/error', () => {
    throw new Error('Test 500 error')
  })
}

// Routers
app.use('/api/items', itemRoutes)

// 404 handler - MUST come after all valid routes
app.use(notFound)

// Global error handler - MUST be last
app.use(errorHandler)

export type { app }
export default app
