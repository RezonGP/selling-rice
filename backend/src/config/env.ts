import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  INSTANCE_ID: process.env.INSTANCE_ID || 'backend-1',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:80,http://localhost:3000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://admin:RicePass2026!@localhost:27017/rice_ecommerce?authSource=admin',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'SuperSecretRiceJWTKey2026ProductionOnly!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'SuperSecretRiceJWTRefreshKey2026!',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  OTP_SECRET_KEY: process.env.OTP_SECRET_KEY || 'RiceOTPSecretEncryptionKey2026!',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '"Nông Sản Việt" <no-reply@nongsanviet.vn>',
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || 'admin@nongsanviet.vn',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || 'AdminRice2026@Secure!',
};
