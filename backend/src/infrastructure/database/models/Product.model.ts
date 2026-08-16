import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, RiceCategory } from '../../../domain/entities/types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const PackagingOptionSchema = new Schema(
  {
    sizeKg: { type: Number, required: true },
    unitName: { type: String, required: true },
    priceVnd: { type: Number, required: true },
    wholesalePriceVnd: { type: Number },
    stockQuantity: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const RiceCharacteristicsSchema = new Schema(
  {
    stickiness: { type: Number, min: 1, max: 5, default: 4 },
    aroma: { type: Number, min: 1, max: 5, default: 4 },
    softness: { type: Number, min: 1, max: 5, default: 4 },
    chalkiness: { type: Number, min: 1, max: 5, default: 1 },
    grainLengthMm: { type: Number, default: 7.2 },
    originRegion: { type: String, required: true },
    harvestSeason: { type: String, required: true },
  },
  { _id: false }
);

const TieredDiscountSchema = new Schema(
  {
    minQuantityKg: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema: Schema = new Schema<IProductDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, enum: Object.values(RiceCategory), required: true, index: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    characteristics: { type: RiceCharacteristicsSchema, required: true },
    packagingOptions: [PackagingOptionSchema],
    tieredDiscounts: [TieredDiscountSchema],
    isFeatured: { type: Boolean, default: false, index: true },
    isB2BAvailable: { type: Boolean, default: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound Index for Search & Category Filter
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, isActive: 1, isFeatured: 1 });

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
