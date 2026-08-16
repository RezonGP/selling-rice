import { BatchModel, IBatchDocument } from '../database/models/Batch.model';
import { IBatch } from '../../domain/entities/types';

export class BatchRepository {
  async findAll(): Promise<IBatchDocument[]> {
    return BatchModel.find().populate('productId').sort({ expiryDate: 1 }).exec();
  }

  async findById(id: string): Promise<IBatchDocument | null> {
    return BatchModel.findById(id).exec();
  }

  async findByProduct(productId: string): Promise<IBatchDocument[]> {
    return BatchModel.find({ productId }).sort({ packDate: -1 }).exec();
  }

  async create(batch: Partial<IBatch>): Promise<IBatchDocument> {
    const newBatch = new BatchModel(batch);
    return newBatch.save();
  }

  async findLowStockBatches(thresholdKg: number = 200): Promise<IBatchDocument[]> {
    return BatchModel.find({ totalWeightKg: { $lte: thresholdKg }, isLowStockWarningSent: false }).exec();
  }

  async markWarningSent(batchId: string): Promise<void> {
    await BatchModel.findByIdAndUpdate(batchId, { isLowStockWarningSent: true }).exec();
  }
}
