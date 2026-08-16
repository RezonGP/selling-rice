import { OrderModel, IOrderDocument } from '../database/models/Order.model';
import { IOrder, OrderStatus, PaymentStatus } from '../../domain/entities/types';

export class OrderRepository {
  async create(order: Partial<IOrder>, session?: any): Promise<IOrderDocument> {
    const newOrder = new OrderModel(order);
    return newOrder.save({ session });
  }

  async findByCode(orderCode: string): Promise<IOrderDocument | null> {
    return OrderModel.findOne({ orderCode: orderCode.toUpperCase() }).exec();
  }

  async findById(id: string): Promise<IOrderDocument | null> {
    return OrderModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<IOrderDocument[]> {
    return OrderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(filter: { status?: OrderStatus; isB2B?: boolean } = {}): Promise<IOrderDocument[]> {
    const query: any = {};
    if (filter.status) query.orderStatus = filter.status;
    if (filter.isB2B !== undefined) query.isB2BOrder = filter.isB2B;
    return OrderModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, orderStatus: OrderStatus, trackingCode?: string): Promise<IOrderDocument | null> {
    const update: any = { orderStatus };
    if (trackingCode) update.carrierTrackingCode = trackingCode;
    return OrderModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<IOrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, { paymentStatus }, { new: true }).exec();
  }

  async getSalesMetrics(): Promise<{ totalRevenue: number; totalWeightKg: number; totalOrders: number }> {
    const result = await OrderModel.aggregate([
      { $match: { orderStatus: { $ne: OrderStatus.CANCELLED } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalVnd' },
          totalWeightKg: { $sum: '$totalWeightKg' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    if (!result.length) return { totalRevenue: 0, totalWeightKg: 0, totalOrders: 0 };
    return result[0];
  }
}
