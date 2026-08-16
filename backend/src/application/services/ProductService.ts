import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { IProduct, RiceCategory } from '../../domain/entities/types';
import { redisClient } from '../../config/redis';
import { logger } from '../../config/logger';

const PRODUCT_CACHE_TTL = 300; // 5 minutes in Redis

export class ProductService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getAllProducts(filter: { category?: RiceCategory; isFeatured?: boolean; search?: string } = {}): Promise<IProduct[]> {
    const cacheKey = `products:${filter.category || 'all'}:${filter.isFeatured || 'all'}:${filter.search || 'none'}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      logger.warn('Redis read cache error in ProductService', { err });
    }

    const products = await this.productRepo.findAll(filter);
    const result = products.map((p) => p.toObject());

    try {
      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', PRODUCT_CACHE_TTL);
    } catch (err) {
      logger.warn('Redis write cache error in ProductService', { err });
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    const product = await this.productRepo.findBySlug(slug);
    return product ? product.toObject() : null;
  }

  async getProductById(id: string): Promise<IProduct | null> {
    const product = await this.productRepo.findById(id);
    return product ? product.toObject() : null;
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const product = await this.productRepo.create(productData);
    await this.clearProductCache();
    return product.toObject();
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    const updated = await this.productRepo.update(id, productData);
    await this.clearProductCache();
    return updated ? updated.toObject() : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await this.productRepo.delete(id);
    await this.clearProductCache();
    return Boolean(deleted);
  }

  private async clearProductCache(): Promise<void> {
    try {
      const keys = await redisClient.keys('products:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (err) {
      logger.warn('Redis clear cache error in ProductService', { err });
    }
  }
}
