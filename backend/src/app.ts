import express, { Express } from 'express';
import { rateLimiter } from './middleware/rate-limit.middleware.ts';
import { errorHandler } from './middleware/error.middleware.ts';

// Module routers
import authRoutes from './modules/auth/auth.routes.ts';
import usersRoutes from './modules/users/users.routes.ts';
import restaurantsRoutes from './modules/restaurants/restaurants.routes.ts';
import menuRoutes from './modules/menu/menu.routes.ts';
import ordersRoutes from './modules/orders/orders.routes.ts';
import paymentsRoutes from './modules/payments/payments.routes.ts';
import deliveryRoutes from './modules/delivery/delivery.routes.ts';
import addressesRoutes from './modules/addresses/addresses.routes.ts';
import couponsRoutes from './modules/coupons/coupons.routes.ts';
import notificationsRoutes from './modules/notifications/notifications.routes.ts';
import reviewsRoutes from './modules/reviews/reviews.routes.ts';
import supportRoutes from './modules/support/support.routes.ts';
import adminRoutes from './modules/admin/admin.routes.ts';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimiter(200, 60000)); // 200 requests per minute

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'BiteDash API',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/restaurants', restaurantsRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/payments', paymentsRoutes);
  app.use('/api/delivery', deliveryRoutes);
  app.use('/api/addresses', addressesRoutes);
  app.use('/api/coupons', couponsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/admin', adminRoutes);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
