import mongoose from 'mongoose';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { ShippingService } from './ShippingService';
import { PaymentService } from './PaymentService';
import { IOrder, IOrderItem, IShippingAddress, OrderStatus, PaymentMethod, PaymentStatus } from '../../domain/entities/types';
import { orderQueue } from '../../jobs/queue';
import { logger } from '../../config/logger';

export class OrderService {
  private orderRepo: OrderRepository;
  private productRepo: ProductRepository;
  private shippingService: ShippingService;
  private paymentService: PaymentService;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.productRepo = new ProductRepository();
    this.shippingService = new ShippingService();
    this.paymentService = new PaymentService();
  }

  async createOrder(data: {
    userId?: string;
    userEmail?: string;
    items: Array<{ productId: string; sizeKg: number; quantity: number }>;
    shippingAddress: IShippingAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
    ipAddress: string;
  }): Promise<{ order: IOrder; paymentUrl?: string | null }> {
    let subtotalVnd = 0;
    let totalWeightKg = 0;
    const processedItems: IOrderItem[] = [];

    // Process & validate items
    for (const itemInput of data.items) {
      const product = await this.productRepo.findById(itemInput.productId);
      if (!product || !product.isActive) {
        throw new Error(`Product not found or inactive: ${itemInput.productId}`);
      }

      const packaging = product.packagingOptions.find((p) => p.sizeKg === itemInput.sizeKg);
      if (!packaging || !packaging.isAvailable) {
        throw new Error(`Packaging size ${itemInput.sizeKg}kg not available for product ${product.name}`);
      }

      if (packaging.stockQuantity < itemInput.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (${itemInput.sizeKg}kg). Only ${packaging.stockQuantity} left.`);
      }

      const itemWeightKg = itemInput.sizeKg * itemInput.quantity;
      const pricePerUnit = packaging.priceVnd;
      const itemTotalPrice = pricePerUnit * itemInput.quantity;

      subtotalVnd += itemTotalPrice;
      totalWeightKg += itemWeightKg;

      processedItems.push({
        productId: product._id.toString(),
        productName: product.name,
        packagingSizeKg: itemInput.sizeKg,
        unitName: packaging.unitName,
        quantity: itemInput.quantity,
        priceVnd: pricePerUnit,
        itemTotalWeightKg: itemWeightKg,
        itemTotalPriceVnd: itemTotalPrice,
      });
    }

    // Apply Tiered Wholesale Volume Discount
    let discountVnd = 0;
    if (totalWeightKg >= 500) {
      discountVnd = Math.round(subtotalVnd * 0.15);
    } else if (totalWeightKg >= 100) {
      discountVnd = Math.round(subtotalVnd * 0.1);
    } else if (totalWeightKg >= 50) {
      discountVnd = Math.round(subtotalVnd * 0.05);
    }

    // Calculate Weight-Based Shipping Fee
    const shippingCalc = this.shippingService.calculateShippingFee({
      totalWeightKg,
      province: data.shippingAddress.province,
      subtotalVnd,
    });

    const totalVnd = subtotalVnd - discountVnd + shippingCalc.shippingFeeVnd;

    // Generate unique order code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `RICE-${dateStr}-${randomDigits}`;

    const newOrderData: Partial<IOrder> = {
      orderCode,
      userId: data.userId,
      items: processedItems,
      totalWeightKg,
      subtotalVnd,
      discountVnd,
      shippingFeeVnd: shippingCalc.shippingFeeVnd,
      totalVnd,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      shippingCarrier: shippingCalc.carrier,
      notes: data.notes,
      isB2BOrder: totalWeightKg >= 50 || Boolean(data.shippingAddress.isCorporateAddress),
    };

    // Try to use Mongoose Transaction (requires Replica Set); fall back gracefully for standalone
    let orderDoc: any;
    const supportsTransactions = mongoose.connection.readyState === 1;

    if (supportsTransactions) {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        // Deduct inventory stock atomically
        for (const item of processedItems) {
          await this.productRepo.updateStock(item.productId, item.packagingSizeKg, -item.quantity, session);
        }

        orderDoc = await this.orderRepo.create(newOrderData, session);
        await session.commitTransaction();
      } catch (err: any) {
        await session.abortTransaction();

        // Standalone MongoDB does not support transactions — fallback to non-transactional
        if (err?.codeName === 'OperationNotSupportedInTransaction' || err?.message?.includes('replica')) {
          logger.warn('[OrderService] MongoDB standalone detected — falling back to non-transactional order creation.');
          orderDoc = await this.createOrderWithoutTransaction(newOrderData, processedItems);
        } else {
          logger.error('Order creation transaction failed', { err });
          throw err;
        }
      } finally {
        session.endSession();
      }
    } else {
      orderDoc = await this.createOrderWithoutTransaction(newOrderData, processedItems);
    }

    // Generate Payment Gateway URL if online payment
    const paymentUrl = this.paymentService.processPaymentLink(orderCode, totalVnd, data.paymentMethod, data.ipAddress);

    // Push async job to BullMQ queue — uses correct email field (Bug #1 fix)
    const customerEmail = data.userEmail || `order-${orderCode}@internal.nongsanviet.vn`;
    try {
      await orderQueue.add('process-new-order', {
        orderId: orderDoc._id.toString(),
        orderCode,
        totalWeightKg,
        customerEmail, // ✅ Fixed: was incorrectly using shippingAddress.phone
        totalVnd,
      });
    } catch (err) {
      logger.warn('Failed to enqueue order job to BullMQ (Redis may be offline)', { err });
      // Non-critical: order is created, just no async processing
    }

    return {
      order: orderDoc.toObject(),
      paymentUrl,
    };
  }

  // Fallback: create order without MongoDB transaction (standalone MongoDB)
  private async createOrderWithoutTransaction(
    orderData: Partial<IOrder>,
    items: IOrderItem[]
  ): Promise<any> {
    // Deduct stock sequentially (best-effort, no atomicity guarantee)
    for (const item of items) {
      await this.productRepo.updateStock(item.productId, item.packagingSizeKg, -item.quantity);
    }
    return this.orderRepo.create(orderData);
  }

  async getOrderByCode(code: string): Promise<IOrder | null> {
    const order = await this.orderRepo.findByCode(code);
    return order ? order.toObject() : null;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    const orders = await this.orderRepo.findByUser(userId);
    return orders.map((o) => o.toObject());
  }

  async getAllOrders(filter: { status?: OrderStatus; isB2B?: boolean } = {}): Promise<IOrder[]> {
    const orders = await this.orderRepo.findAll(filter);
    return orders.map((o) => o.toObject());
  }

  async updateOrderStatus(id: string, status: OrderStatus, trackingCode?: string): Promise<IOrder | null> {
    const updated = await this.orderRepo.updateStatus(id, status, trackingCode);
    return updated ? updated.toObject() : null;
  }
}
