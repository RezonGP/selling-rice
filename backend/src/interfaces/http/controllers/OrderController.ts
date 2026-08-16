import { Response, NextFunction } from 'express';
import { OrderService } from '../../../application/services/OrderService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { OrderStatus } from '../../../domain/entities/types';
import { metricsService } from '../../../application/services/MetricsService';

const orderService = new OrderService();

export class OrderController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const result = await orderService.createOrder({
        userId: req.user?.sub,
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        notes: req.body.notes,
        ipAddress,
      });

      // Increment Prometheus sales weight metric
      metricsService.totalSalesWeightKg.inc(result.order.totalWeightKg);

      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getByCode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderByCode(req.params.code);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getUserOrders(req.user!.sub);
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, isB2B } = req.query;
      const orders = await orderService.getAllOrders({
        status: status as OrderStatus,
        isB2B: isB2B ? isB2B === 'true' : undefined,
      });
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, trackingCode } = req.body;
      const updated = await orderService.updateOrderStatus(req.params.id, status, trackingCode);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
