import app from './app';
import { connectDB } from './config/db';
import { initMySQLTables } from './config/mysql';
import { env } from './config/env';
import { logger } from './config/logger';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { AuthService } from './application/services/AuthService';
import { UserRole } from './domain/entities/types';
import { startOrderWorker } from './jobs/workers/orderWorker';

const startServer = async () => {
  try {
    // 1. Connect MongoDB (Optional)
    const mongoConn = await connectDB();

    // 2. Initialize MySQL Tables (products, orders)
    await initMySQLTables();

    // 3. Seed Initial Admin Account if MongoDB is enabled
    if (mongoConn) {
      const userRepo = new UserRepository();
      const authService = new AuthService();
      const adminUser = await userRepo.findByEmail(env.INITIAL_ADMIN_EMAIL);
      if (!adminUser) {
        const passwordHash = await authService.hashPassword(env.INITIAL_ADMIN_PASSWORD);
        await userRepo.create({
          fullName: 'Lead Admin Nông Sản Việt',
          email: env.INITIAL_ADMIN_EMAIL,
          phone: '0901234567',
          passwordHash,
          role: UserRole.ADMIN,
          isB2BVerified: true,
        });
        logger.info(`Seeded initial Admin user: ${env.INITIAL_ADMIN_EMAIL}`);
      }
    }

    // 4. Start BullMQ Queue Workers
    startOrderWorker();

    // 5. Start Express HTTP Server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server instance [${env.INSTANCE_ID}] running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      logger.info('Received shutdown signal, terminating server gracefully...');
      server.close(() => {
        logger.info('HTTP Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Error starting backend server', { error });
    process.exit(1);
  }
};

startServer();
