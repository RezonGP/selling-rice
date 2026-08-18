import mongoose from 'mongoose';
import { ProductModel, IProductDocument } from '../database/models/Product.model';
import { IProduct, RiceCategory } from '../../domain/entities/types';
import { logger } from '../../config/logger';

const SAMPLE_PRODUCTS: any[] = [
  {
    _id: '64d2f8e1234567890abcdef1',
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
    toObject: function() { return this; }
  },
  {
    _id: '64d2f8e1234567890abcdef2',
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
    toObject: function() { return this; }
  },
  {
    _id: '64d2f8e1234567890abcdef3',
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
    toObject: function() { return this; }
  },
];

export class ProductRepository {
  async findAll(filter: { category?: RiceCategory; isFeatured?: boolean; search?: string } = {}): Promise<any[]> {
    try {
      if (mongoose.connection.readyState === 1) {
        const query: any = { isActive: true };
        if (filter.category) query.category = filter.category;
        if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
        if (filter.search) query.$text = { $search: filter.search };
        const docs = await ProductModel.find(query).sort({ isFeatured: -1, createdAt: -1 }).exec();
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      logger.warn('[ProductRepository] DB query failed, serving fallback rice list', { err });
    }

    // Fallback sample rice products
    return SAMPLE_PRODUCTS.filter((p) => {
      if (filter.category && p.category !== filter.category) return false;
      if (filter.isFeatured !== undefined && p.isFeatured !== filter.isFeatured) return false;
      return true;
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await ProductModel.findOne({ slug: slug.toLowerCase(), isActive: true }).exec();
        if (doc) return doc;
      }
    } catch (err) {
      logger.warn('[ProductRepository] DB findBySlug failed, checking fallback products', { err });
    }
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug.toLowerCase()) || null;
  }

  async findById(id: string): Promise<any | null> {
    try {
      if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
        const doc = await ProductModel.findById(id).exec();
        if (doc) return doc;
      }
    } catch (err) {
      logger.warn('[ProductRepository] DB findById failed', { err });
    }
    return SAMPLE_PRODUCTS.find((p) => p._id === id) || null;
  }

  async create(product: Partial<IProduct>): Promise<any> {
    const newProduct = new ProductModel(product);
    return newProduct.save();
  }

  async update(id: string, product: Partial<IProduct>): Promise<any | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async delete(id: string): Promise<any | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async updateStock(id: string, sizeKg: number, deltaQuantity: number, session?: any): Promise<any | null> {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      return ProductModel.findOneAndUpdate(
        { _id: id, 'packagingOptions.sizeKg': sizeKg },
        { $inc: { 'packagingOptions.$.stockQuantity': deltaQuantity } },
        { new: true, session }
      ).exec();
    }
    return null;
  }
}
