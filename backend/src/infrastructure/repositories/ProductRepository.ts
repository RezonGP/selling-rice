import mongoose from 'mongoose';
import { ProductModel, IProductDocument } from '../database/models/Product.model';
import { IProduct, RiceCategory } from '../../domain/entities/types';

export class ProductRepository {
  async findAll(filter: { category?: RiceCategory; isFeatured?: boolean; search?: string } = {}): Promise<IProductDocument[]> {
    const query: any = { isActive: true };
    if (filter.category) {
      query.category = filter.category;
    }
    if (filter.isFeatured !== undefined) {
      query.isFeatured = filter.isFeatured;
    }
    if (filter.search) {
      query.$text = { $search: filter.search };
    }
    return ProductModel.find(query).sort({ isFeatured: -1, createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<IProductDocument | null> {
    return ProductModel.findOne({ slug: slug.toLowerCase(), isActive: true }).exec();
  }

  async findById(id: string): Promise<IProductDocument | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findById(id).exec();
  }

  async create(product: Partial<IProduct>): Promise<IProductDocument> {
    const newProduct = new ProductModel(product);
    return newProduct.save();
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProductDocument | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async delete(id: string): Promise<IProductDocument | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async updateStock(id: string, sizeKg: number, deltaQuantity: number, session?: any): Promise<IProductDocument | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ProductModel.findOneAndUpdate(
      { _id: id, 'packagingOptions.sizeKg': sizeKg },
      { $inc: { 'packagingOptions.$.stockQuantity': deltaQuantity } },
      { new: true, session }
    ).exec();
  }
}
