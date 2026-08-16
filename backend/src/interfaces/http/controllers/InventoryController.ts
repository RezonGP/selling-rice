import { Response, NextFunction } from 'express';
import { InventoryService } from '../../../application/services/InventoryService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const inventoryService = new InventoryService();

export class InventoryController {
  async createBatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const batch = await inventoryService.createBatch(req.body);
      return res.status(201).json({ success: true, data: batch });
    } catch (error) {
      next(error);
    }
  }

  async getAllBatches(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const batches = await inventoryService.getAllBatches();
      return res.status(200).json({ success: true, count: batches.length, data: batches });
    } catch (error) {
      next(error);
    }
  }

  async getLowStockWarnings(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const warnings = await inventoryService.checkLowStockWarnings();
      return res.status(200).json({ success: true, count: warnings.length, data: warnings });
    } catch (error) {
      next(error);
    }
  }
}
