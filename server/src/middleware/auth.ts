import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Protects routes by verifying the JWT stored in an httpOnly cookie.
 * Attaches req.user = { id, email } on success.
 */
export const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    return next(ApiError.unauthorized('Not authorized — no token provided'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    next(ApiError.unauthorized('Not authorized — token is invalid or expired'));
  }
};
