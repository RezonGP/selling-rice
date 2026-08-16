import mongoose, { Schema, Document } from 'mongoose';
import { IBatch } from '../../../domain/entities/types';

export interface IBatchDocument extends Omit<IBatch, '_id' | 'productId'>, Document {
  productId: mongoose.Types.ObjectId | string;
}

const BatchSchema: Schema = new Schema<IBatchDocument>(
  {
    batchNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    packagingSizeKg: { type: Number, required: true },
    packDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true, index: true },
    initialQuantityPackages: { type: Number, required: true },
    remainingQuantityPackages: { type: Number, required: true },
    totalWeightKg: { type: Number, required: true },
    supplier: { type: String, required: true },
    qualityGrade: { type: String, required: true, default: 'Grade A Export' },
    notes: { type: String },
    isLowStockWarningSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BatchSchema.index({ productId: 1, expiryDate: 1 });

export const BatchModel = mongoose.model<IBatchDocument>('Batch', BatchSchema);
