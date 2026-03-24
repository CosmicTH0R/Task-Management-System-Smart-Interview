import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { ApiError } from './utils/ApiError';
import { apiLimiter } from './middleware/rateLimiter';
import authRouter from './routes/auth.routes';
import taskRouter from './routes/task.routes';
import analyticsRouter from './routes/analytics.routes';

const app = express();

// ─── Security Headers ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Security Middleware ─────────────────────────────────────────────────────
// NoSQL injection prevention — Express 5 compatible wrapper
// (Express 5 makes req.query a read-only getter; we shadow it with an own writable prop first)
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    const ownQuery = { ...req.query };
    Object.defineProperty(req, 'query', {
      value: ownQuery, writable: true, configurable: true, enumerable: true,
    });
  } catch (_) { /* ignore — req.query may already be writable */ }
  mongoSanitize()(req, res, next);
});

// HTTP Parameter Pollution prevention
app.use(hpp());

// ─── Global Rate Limiter — skipped in test environment ──────────────────────
if (env.NODE_ENV !== 'test') {
  app.use('/api', apiLimiter);
}

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running', env: env.NODE_ENV });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter); // Phase 3
app.use('/api/analytics', analyticsRouter); // Phase 4

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound('Route not found'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
