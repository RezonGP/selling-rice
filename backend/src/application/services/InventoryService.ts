import { BatchRepository } from '../../infrastructure/repositories/BatchRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { IBatch } from '../../domain/entities/types';
import { logger } from '../../config/logger';

export class InventoryService {
  private batchRepo: BatchRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.batchRepo = new BatchRepository();
    this.productRepo = new ProductRepository();
  }

  async createBatch(batchData: Partial<IBatch>): Promise<IBatch> {
    const totalWeightKg = (batchData.packagingSizeKg || 0) * (batchData.initialQuantityPackages || 0);
    const newBatchData = {
      ...batchData,
      remainingQuantityPackages: batchData.initialQuantityPackages,
      totalWeightKg,
    };

    const batch = await this.batchRepo.create(newBatchData);

    // Sync product stock
    if (batch.productId && batch.packagingSizeKg) {
      await this.productRepo.updateStock(batch.productId.toString(), batch.packagingSizeKg, batch.initialQuantityPackages);
    }

    return batch.toObject();
  }

  async getAllBatches(): Promise<IBatch[]> {
    const batches = await this.batchRepo.findAll();
    return batches.map((b) => b.toObject());
  }

  async getBatchesByProduct(productId: string): Promise<IBatch[]> {
    const batches = await this.batchRepo.findByProduct(productId);
    return batches.map((b) => b.toObject());
  }

  async checkLowStockWarnings(): Promise<IBatch[]> {
    const lowStockBatches = await this.batchRepo.findLowStockBatches(200); // Threshold 200 kg
    for (const batch of lowStockBatches) {
      logger.warn(`LOW STOCK WARNING: Batch ${batch.batchNumber} has only ${batch.totalWeightKg} kg remaining!`);
      await this.batchRepo.markWarningSent(batch._id.toString());
    }
    return lowStockBatches.map((b) => b.toObject());
  }
}
