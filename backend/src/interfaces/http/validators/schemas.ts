import { z } from 'zod';
import { RiceCategory, PaymentMethod, OrderStatus } from '../../../domain/entities/types';

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  otpToken: z.string().optional(),
});

export const CreateProductSchema = z.object({
  code: z.string().min(2, 'Mã SKU tối thiểu 2 ký tự'),
  name: z.string().min(2, 'Tên gạo tối thiểu 2 ký tự'),
  category: z.nativeEnum(RiceCategory),
  description: z.string().min(2, 'Mô tả tối thiểu 2 ký tự'),
  images: z.array(z.string().url()).optional(),
  characteristics: z.object({
    stickiness: z.number().min(1).max(5),
    aroma: z.number().min(1).max(5),
    softness: z.number().min(1).max(5),
    originRegion: z.string().min(2),
    harvestSeason: z.string().min(2),
  }),
  packagingOptions: z.array(
    z.object({
      sizeKg: z.number().positive(),
      unitName: z.string(),
      priceVnd: z.number().positive(),
      wholesalePriceVnd: z.number().optional(),
      stockQuantity: z.number().nonnegative(),
    })
  ),
  isFeatured: z.boolean().optional(),
  isB2BAvailable: z.boolean().optional(),
});

export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      sizeKg: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least 1 item'),
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Họ tên tối thiểu 1 ký tự'),
    phone: z.string().min(8, 'Số điện thoại tối thiểu 8 số'),
    province: z.string().min(1),
    district: z.string().min(1),
    ward: z.string().min(1),
    streetAddress: z.string().min(1, 'Địa chỉ tối thiểu 1 ký tự'),
    isCorporateAddress: z.boolean().optional(),
    companyName: z.string().optional(),
  }),
  paymentMethod: z.nativeEnum(PaymentMethod),
  notes: z.string().optional(),
});

export const CreateBatchSchema = z.object({
  batchNumber: z.string().min(3),
  productId: z.string().min(24),
  packagingSizeKg: z.number().positive(),
  packDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()),
  initialQuantityPackages: z.number().int().positive(),
  supplier: z.string().min(2),
  qualityGrade: z.string().default('Grade A Export'),
  notes: z.string().optional(),
});

export const CreateB2BQuoteSchema = z.object({
  companyName: z.string().min(2),
  vatNumber: z.string().min(5),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  riceVarietyNeeded: z.string().min(2),
  estimatedMonthlyVolumeTons: z.number().positive(),
  preferredPackaging: z.string().min(2),
  deliveryLocation: z.string().min(2),
});
