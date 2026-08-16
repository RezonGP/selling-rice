import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { ProductModel } from '../infrastructure/database/models/Product.model';
import { UserModel } from '../infrastructure/database/models/User.model';
import { BatchModel } from '../infrastructure/database/models/Batch.model';
import { AuthService } from '../application/services/AuthService';
import { RiceCategory, UserRole } from '../domain/entities/types';
import { env } from '../config/env';
import { logger } from '../config/logger';

const seedDatabase = async () => {
  const forceReseed = process.argv.includes('--force');
  try {
    await connectDB();
    logger.info('Seeding database with sample rice data...');

    // Clear existing product/batch data always (idempotent seed)
    await ProductModel.deleteMany({});
    await BatchModel.deleteMany({});
    if (forceReseed) {
      // Full reset including admin user
      await UserModel.deleteMany({});
      logger.info('[Seed] --force: Deleted all existing users for fresh seed.');
    }

    // 1. Seed Products
    const productsData = [
      {
        code: 'ST25-PREMIUM',
        name: 'Gạo ST25 Lúa Tôm Thơm Thượng Hạng',
        slug: 'gao-st25-lua-tom',
        category: RiceCategory.SPECIALTY,
        description:
          'Gạo ST25 chính hiệu Sóc Trăng hạt dài, trắng ngần, cơm dẻo thơm nhiều, vị ngọt tự nhiên. Được chứng nhận giải nhất Gạo Thơm Ngon Nhất Thế Giới.',
        images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800'],
        characteristics: {
          stickiness: 5,
          aroma: 5,
          softness: 5,
          chalkiness: 1,
          grainLengthMm: 7.5,
          originRegion: 'Sóc Trăng',
          harvestSeason: 'Vụ Đông Xuân 2026',
        },
        packagingOptions: [
          { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 195000, stockQuantity: 100, isAvailable: true },
          { sizeKg: 10, unitName: 'Túi 10kg', priceVnd: 380000, stockQuantity: 80, isAvailable: true },
          { sizeKg: 25, unitName: 'Bao 25kg', priceVnd: 920000, stockQuantity: 40, isAvailable: true },
          { sizeKg: 50, unitName: 'Bao 50kg Sỉ', priceVnd: 1800000, stockQuantity: 20, isAvailable: true },
        ],
        tieredDiscounts: [
          { minQuantityKg: 50, discountPercentage: 5 },
          { minQuantityKg: 100, discountPercentage: 10 },
          { minQuantityKg: 500, discountPercentage: 15 },
        ],
        isFeatured: true,
        isB2BAvailable: true,
        isActive: true,
        ratingAverage: 4.9,
        ratingCount: 128,
      },
      {
        code: 'LUT-RED-01',
        name: 'Gạo Lứt Huyết Rồng Điện Biên',
        slug: 'gao-lut-huyet-rong',
        category: RiceCategory.BROWN,
        description: 'Gạo lứt giảm cân, nhiều chất xơ, hỗ trợ tim mạch và người ăn kiêng thực dưỡng.',
        images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800'],
        characteristics: {
          stickiness: 3,
          aroma: 4,
          softness: 4,
          chalkiness: 2,
          grainLengthMm: 6.8,
          originRegion: 'Điện Biên',
          harvestSeason: 'Vụ Hè Thu 2026',
        },
        packagingOptions: [
          { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 160000, stockQuantity: 120, isAvailable: true },
          { sizeKg: 10, unitName: 'Túi 10kg', priceVnd: 310000, stockQuantity: 60, isAvailable: true },
        ],
        tieredDiscounts: [{ minQuantityKg: 100, discountPercentage: 8 }],
        isFeatured: true,
        isB2BAvailable: true,
        isActive: true,
        ratingAverage: 4.8,
        ratingCount: 85,
      },
      {
        code: 'ECO-ORGANIC-01',
        name: 'Gạo Hữu Cơ Eco Sạch Chuẩn USDA',
        slug: 'gao-huu-co-eco',
        category: RiceCategory.ORGANIC,
        description: 'Không thuốc trừ sâu, không chất bảo quản, đạt chứng nhận hữu cơ quốc tế.',
        images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800'],
        characteristics: {
          stickiness: 4,
          aroma: 4,
          softness: 5,
          chalkiness: 1,
          grainLengthMm: 7.2,
          originRegion: 'An Giang',
          harvestSeason: 'Vụ Đông Xuân 2026',
        },
        packagingOptions: [
          { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 220000, stockQuantity: 80, isAvailable: true },
          { sizeKg: 25, unitName: 'Bao 25kg', priceVnd: 1050000, stockQuantity: 30, isAvailable: true },
        ],
        tieredDiscounts: [{ minQuantityKg: 100, discountPercentage: 10 }],
        isFeatured: true,
        isB2BAvailable: true,
        isActive: true,
        ratingAverage: 5.0,
        ratingCount: 64,
      },
    ];

    const insertedProducts = await ProductModel.insertMany(productsData);
    logger.info(`Inserted ${insertedProducts.length} sample rice products into database.`);

    // 2. Seed Inventory Batches
    const st25Product = insertedProducts[0];
    await BatchModel.create({
      batchNumber: 'BATCH-202608-ST25-01',
      productId: st25Product._id,
      packagingSizeKg: 5,
      packDate: new Date('2026-08-01'),
      expiryDate: new Date('2027-08-01'),
      initialQuantityPackages: 100,
      remainingQuantityPackages: 100,
      totalWeightKg: 500,
      supplier: 'HTX Nông Nghiệp Sóc Trăng',
      qualityGrade: 'Grade A+ Export',
    });

    // 3. Seed Admin User
    const authService = new AuthService();
    const adminUser = await UserModel.findOne({ email: env.INITIAL_ADMIN_EMAIL });
    if (!adminUser) {
      const passwordHash = await authService.hashPassword(env.INITIAL_ADMIN_PASSWORD);
      await UserModel.create({
        fullName: 'Lead Admin Nông Sản Việt',
        email: env.INITIAL_ADMIN_EMAIL,
        phone: '0901234567',
        passwordHash,
        role: UserRole.ADMIN,
        isB2BVerified: true,
      });
      logger.info(`Seeded Admin User: ${env.INITIAL_ADMIN_EMAIL}`);
    }

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database', { error });
    process.exit(1);
  }
};

seedDatabase();
