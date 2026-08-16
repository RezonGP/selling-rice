import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { OrderRepository } from '../../../infrastructure/repositories/OrderRepository';
import { AuditService } from '../../../application/services/AuditService';

const orderRepo = new OrderRepository();
const auditService = new AuditService();

export class AdminController {
  async getDashboardMetrics(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const salesMetrics = await orderRepo.getSalesMetrics();
      const recentAuditLogs = await auditService.getLogs(10);

      return res.status(200).json({
        success: true,
        data: {
          totalRevenueVnd: salesMetrics.totalRevenue,
          totalVolumeKg: salesMetrics.totalWeightKg,
          totalVolumeTons: (salesMetrics.totalWeightKg / 1000).toFixed(2),
          totalOrders: salesMetrics.totalOrders,
          recentLogs: recentAuditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const logs = await auditService.getLogs(100);
      return res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
      next(error);
    }
  }
}
