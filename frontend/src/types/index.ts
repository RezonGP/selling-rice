export enum RiceCategory {
  SPECIALTY = 'Gạo Đặc Sản ST',
  ORGANIC = 'Gạo Hữu Cơ Eco',
  BROWN = 'Gạo Lứt Dinh Dưỡng',
  DAILY = 'Gạo Hằng Ngày',
  GLUTINOUS = 'Gạo Nếp Thơm',
}

export interface IPackagingOption {
  sizeKg: number;
  unitName: string;
  priceVnd: number;
  wholesalePriceVnd?: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface IRiceCharacteristics {
  stickiness: number;
  aroma: number;
  softness: number;
  chalkiness: number;
  grainLengthMm: number;
  originRegion: string;
  harvestSeason: string;
}

export interface ITieredDiscount {
  minQuantityKg: number;
  discountPercentage: number;
}

export interface IProduct {
  _id: string;
  code: string;
  name: string;
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
}

export interface ICartItem {
  product: IProduct;
  selectedSizeKg: number;
  unitName: string;
  priceVnd: number;
  quantity: number;
  itemTotalWeightKg: number;
  itemTotalPriceVnd: number;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  companyName?: string;
  vatNumber?: string;
  isB2BVerified?: boolean;
}

export interface IOrder {
  _id: string;
  orderCode: string;
  items: Array<{
    productId: string;
    productName: string;
    packagingSizeKg: number;
    unitName: string;
    quantity: number;
    priceVnd: number;
    itemTotalWeightKg: number;
    itemTotalPriceVnd: number;
  }>;
  totalWeightKg: number;
  subtotalVnd: number;
  discountVnd: number;
  shippingFeeVnd: number;
  totalVnd: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    isCorporateAddress?: boolean;
    companyName?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  carrierTrackingCode?: string;
  shippingCarrier?: string;
  isB2BOrder?: boolean;
  createdAt: string;
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
  status?: 'PENDING' | 'QUOTED' | 'REJECTED';
  quotedPricePerTonVnd?: number;
  createdAt?: string;
}

export interface IAuditLog {
  _id: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
