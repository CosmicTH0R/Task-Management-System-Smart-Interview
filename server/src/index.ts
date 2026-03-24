import { env } from './config/env';
import connectDB from './config/db';
import app from './app';

// ─── Handle Uncaught Exceptions ──────────────────────────────────────────────
process.on('uncaughtException', (err: Error) => {
  console.error('💀 UNCAUGHT EXCEPTION: Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ─── Connect to Database & Start Server ──────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // ─── Handle Unhandled Promise Rejections ───────────────────────────────────
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('💀 UNHANDLED REJECTION: Shutting down...');
    console.error(reason);
    server.close(() => process.exit(1));
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  const gracefulShutdown = (signal: string) => {
    console.log(`\n⚠️  ${signal} received. Closing HTTP server...`);
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();
