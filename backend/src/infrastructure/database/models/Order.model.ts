import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, OrderStatus, PaymentMethod, PaymentStatus } from '../../../domain/entities/types';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    packagingSizeKg: { type: Number, required: true },
    unitName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceVnd: { type: Number, required: true },
    itemTotalWeightKg: { type: Number, required: true },
    itemTotalPriceVnd: { type: Number, required: true },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    streetAddress: { type: String, required: true },
    isCorporateAddress: { type: Boolean, default: false },
    companyName: { type: String },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema<IOrderDocument>(
  {
    orderCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    items: [OrderItemSchema],
    totalWeightKg: { type: Number, required: true },
    subtotalVnd: { type: Number, required: true },
    discountVnd: { type: Number, default: 0 },
    shippingFeeVnd: { type: Number, required: true },
    totalVnd: { type: Number, required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING, index: true },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING, index: true },
    carrierTrackingCode: { type: String },
    shippingCarrier: { type: String, default: 'ViettelPost Logistics' },
    notes: { type: String },
    isB2BOrder: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ createdAt: -1 });

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema);
