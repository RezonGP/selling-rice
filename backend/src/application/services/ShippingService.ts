export interface IShippingFeeRequest {
  totalWeightKg: number;
  province: string;
  subtotalVnd: number;
}

export class ShippingService {
  /**
   * Weight-based shipping fee calculator for heavy agricultural goods (Rice)
   */
  calculateShippingFee(request: IShippingFeeRequest): { shippingFeeVnd: number; carrier: string; tierName: string } {
    const { totalWeightKg, province, subtotalVnd } = request;

    // Promo: Free shipping for orders >= 2,000,000 VND or >= 100kg
    if (subtotalVnd >= 2000000 || totalWeightKg >= 100) {
      return {
        shippingFeeVnd: 0,
        carrier: 'Giao Hàng Trực Tiếp (Đại Lý Nông Sản Việt)',
        tierName: 'Miễn Phí Vận Chuyển Đơn Hàng Lớn',
      };
    }

    const isLocalProvince = province.toLowerCase().includes('hồ chí minh') || province.toLowerCase().includes('hà nội');
    const baseFee = isLocalProvince ? 25000 : 40000;

    let shippingFeeVnd = 0;
    let tierName = '';

    if (totalWeightKg <= 5) {
      shippingFeeVnd = baseFee;
      tierName = 'Hỏa Tốc Gạo Túi (< 5kg)';
    } else if (totalWeightKg <= 20) {
      const extraKg = totalWeightKg - 5;
      shippingFeeVnd = baseFee + extraKg * 3500;
      tierName = 'Giao Hàng Tiêu Chuẩn (5kg - 20kg)';
    } else if (totalWeightKg <= 50) {
      const extraKg = totalWeightKg - 20;
      shippingFeeVnd = baseFee + 15 * 3500 + extraKg * 2500;
      tierName = 'Giao Hàng Nặng (Bao 25kg - 50kg)';
    } else {
      // > 50kg Heavy Bulk Rate
      shippingFeeVnd = totalWeightKg * 2000;
      tierName = 'Vận Chuyển Chuyên Dụng Tải Trọng Lớn (> 50kg)';
    }

    return {
      shippingFeeVnd: Math.round(shippingFeeVnd / 1000) * 1000, // Round to thousands
      carrier: totalWeightKg >= 50 ? 'ViettelPost Heavy Cargo' : 'GHN Express Rice Line',
      tierName,
    };
  }
}
