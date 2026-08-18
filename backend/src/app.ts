import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { helmetSecurity, mongoSanitizer, xssSanitizer } from './interfaces/http/middlewares/security.middleware';
import { publicApiRateLimiter } from './interfaces/http/middlewares/rateLimiter.middleware';
import { errorHandler } from './interfaces/http/middlewares/errorHandler.middleware';
import { metricsService } from './application/services/MetricsService';

import authRoutes from './interfaces/http/routes/auth.routes';
import productRoutes from './interfaces/http/routes/product.routes';
import orderRoutes from './interfaces/http/routes/order.routes';
import inventoryRoutes from './interfaces/http/routes/inventory.routes';
import b2bRoutes from './interfaces/http/routes/b2b.routes';
import adminRoutes from './interfaces/http/routes/admin.routes';
import metricsRoutes from './interfaces/http/routes/metrics.routes';

const app = express();

// Disable X-Powered-By Header
app.disable('x-powered-by');

// Flexible CORS Setup (Allows VPS IP & Domain)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins in production/staging to ensure VPS IP & domains work seamlessly
      callback(null, true);
    },
    credentials: true,
  })
);

// Payload limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security Hardening
app.use(helmetSecurity);
app.use(mongoSanitizer);
app.use(xssSanitizer);

// Prometheus Metric Interceptor Middleware
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const durationSec = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    metricsService.httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode.toString()).observe(durationSec);
    metricsService.httpRequestsTotal.labels(req.method, route, res.statusCode.toString()).inc();
  });
  next();
});

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    instance: env.INSTANCE_ID,
  });
});

// Prometheus Metrics Route
app.use('/metrics', metricsRoutes);

// Application API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', publicApiRateLimiter, productRoutes);
app.use('/api/v1/orders', publicApiRateLimiter, orderRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/b2b', publicApiRateLimiter, b2bRoutes);
app.use('/api/v1/admin', adminRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
