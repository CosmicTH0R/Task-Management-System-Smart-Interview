import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Known operational error from our ApiError class
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose validation error (e.g., required field missing, enum violation)
  else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    const fields = Object.values(err.errors).map((e) => e.message);
    message = fields.join(', ');
  }

  // Mongoose cast error (e.g., invalid ObjectId format)
  else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB duplicate key error (e.g., duplicate email)
  else if (err instanceof MongoServerError && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Log non-operational errors (programming bugs)
  if (!(err instanceof ApiError) || !err.isOperational) {
    console.error('🔴 Unhandled error:', err);
  }

  res.status(statusCode).json(
    env.NODE_ENV === 'development'
      ? { ...ApiResponse.error(message), stack: err.stack }
      : ApiResponse.error(message),
  );
};
