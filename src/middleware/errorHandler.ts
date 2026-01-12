import type { NextFunction, Request, Response } from 'express'
import { isDev } from '../../env.ts'

export type ValidationErrorDetails = {
  path: PropertyKey[]
  field: string
  message: string
}

export class CustomError extends Error {
  status: number
  details?: ValidationErrorDetails[]
  body?: string
  type?: string

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'InternalServerError'
    this.status = status || 500
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message, // ← Now message will always show!
      status: this.status,
      ...(this.details && { details: this.details }),
      ...(this.type && { type: this.type }),
    }
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: ValidationErrorDetails[]) {
    super(message, 400)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

const isJsonParseError = (err: any): boolean => {
  return (
    err.name === 'SyntaxError' &&
    err.type === 'entity.parse.failed' &&
    'body' in err
  )
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error: CustomError
  let isUnknownError = false

  // Handle specific error types

  if (isJsonParseError(err)) {
    const details = [
      {
        path: ['body'],
        field: '',
        message: `Invalid input: expected json, received ${err.body}`,
      },
    ]
    error = new ValidationError('Invalid Body', details)
  } else if (err instanceof CustomError) {
    // Catches CustomError and subclasses (NotFoundError, ValidationError, etc.)
    error = err
  } else {
    // Unknown Error
    isUnknownError = true
    error = new CustomError(
      err.message || 'Internal Server Error',
      err.status || 500,
    )
  }

  // Log only Unkown Errors in dev
  if (isDev() && isUnknownError) console.error(err.stack)

  res.status(error.status).json({
    error: error,

    // verbose error logging in development
    ...(isDev() && {
      stack: err.stack,
    }),
  })
}

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Not found: ${req.originalUrl}`)
  next(error)
}
