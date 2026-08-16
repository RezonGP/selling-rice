export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  is2FAEnabled: boolean;
  twoFactorSecret?: string;
  companyName?: string;
  vatNumber?: string;
  isB2BVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum RiceCategory {
  SPECIALTY = 'Gạo Đặc Sản ST',
  ORGANIC = 'Gạo Hữu Cơ Eco',
  BROWN = 'Gạo Lứt Dinh Dưỡng',
  DAILY = 'Gạo Hằng Ngày',
  GLUTINOUS = 'Gạo Nếp Thơm',
}

export interface IPackagingOption {
  sizeKg: number; // e.g. 5, 10, 25, 50
  unitName: string; // 'Túi 5kg', 'Túi 10kg', 'Bao 25kg', 'Bao 50kg'
  priceVnd: number; // Retail price per package
  wholesalePriceVnd?: number; // Wholesale price per package
  stockQuantity: number; // Packages available
  isAvailable: boolean;
}

export interface IRiceCharacteristics {
  stickiness: number; // 1 - 5 (Độ dẻo)
  aroma: number; // 1 - 5 (Độ thơm)
  softness: number; // 1 - 5 (Độ mềm)
  chalkiness: number; // 1 - 5 (Độ bạc bụng)
  grainLengthMm: number; // Average grain length in mm
  originRegion: string; // Sóc Trăng, An Giang, Long An, Đồng Tháp
  harvestSeason: string; // Vụ Đông Xuân 2026, Vụ Hè Thu 2026
}

export interface ITieredDiscount {
  minQuantityKg: number;
  discountPercentage: number;
}

export interface IProduct {
  _id?: string;
  code: string; // SKU e.g. ST25-PREMIUM
  name: string; // Gạo ST25 Ông Thọ Chín Rồng
  slug: string;
  category: RiceCategory;
  description: string;
  images: string[];
  characteristics: IRiceCharacteristics;
  packagingOptions: IPackagingOption[];
  tieredDiscounts: ITieredDiscount[];
  isFeatured: boolean;
  isB2BAvailable: boolean;
  isActive: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBatch {
  _id?: string;
  batchNumber: string; // BATCH-202608-ST25-01
  productId: string;
  packagingSizeKg: number;
  packDate: Date;
  expiryDate: Date;
  initialQuantityPackages: number;
  remainingQuantityPackages: number;
  totalWeightKg: number;
  supplier: string; // HTX Nông Nghiệp Sóc Trăng
  qualityGrade: string; // Grade A+ Export
  notes?: string;
  isLowStockWarningSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  STRIPE = 'STRIPE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface IOrderItem {
  productId: string;
  productName: string;
  packagingSizeKg: number;
  unitName: string;
  quantity: number;
  priceVnd: number;
  itemTotalWeightKg: number;
  itemTotalPriceVnd: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isCorporateAddress?: boolean;
  companyName?: string;
}

export interface IOrder {
  _id?: string;
  orderCode: string; // RICE-20260812-9842
  userId?: string;
  items: IOrderItem[];
  totalWeightKg: number; // Sum of all item total weights
  subtotalVnd: number;
  discountVnd: number;
  shippingFeeVnd: number; // Calculated by WeightShippingService
  totalVnd: number;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  carrierTrackingCode?: string;
  shippingCarrier?: string; // ViettelPost / GHN / Internal Fleet
  notes?: string;
  isB2BOrder: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IB2BQuoteRequest {
  _id?: string;
  companyName: string;
  vatNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  riceVarietyNeeded: string;
  estimatedMonthlyVolumeTons: number;
  preferredPackaging: string;
  deliveryLocation: string;
  status: 'PENDING' | 'QUOTED' | 'REJECTED';
  adminNotes?: string;
  quotedPricePerTonVnd?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuditLog {
  _id?: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
  createdAt?: Date;
}
