import React from 'react';
import { Scale, Truck, Gift, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const WeightCalculator: React.FC = () => {
  const { totalWeightKg, subtotalVnd, discountVnd, shippingFeeVnd, province, setProvince } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-rice-green/20 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-sm font-bold text-rice-slate flex items-center gap-2">
          <Scale className="w-5 h-5 text-rice-green" />
          <span>Tính Phí Vận Chuyển Theo Khối Lượng (Kg)</span>
        </h4>
        <span className="text-xs bg-rice-gold/20 text-rice-slate font-extrabold px-2.5 py-0.5 rounded-md">
          {totalWeightKg.toFixed(1)} Kg Total
        </span>
      </div>

      {/* Destination Province Selection */}
      <div>
        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tỉnh / Thành Phố Giao Hàng:</label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-rice-slate focus:outline-none focus:ring-2 focus:ring-rice-green"
        >
          <option value="Hồ Chí Minh">TP. Hồ Chí Minh (Nội thành / Ngoại thành)</option>
          <option value="Hà Nội">TP. Hà Nội (Nội thành / Ngoại thành)</option>
          <option value="Bình Dương">Bình Dương</option>
          <option value="Đồng Nai">Đồng Nai</option>
          <option value="Cần Thơ">Cần Thơ</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Tỉnh Khác">Các Tỉnh Thành Khác</option>
        </select>
      </div>

      {/* Weight Tier Breakdown */}
      <div className="space-y-2 text-xs font-medium text-gray-600 bg-rice-lightgreen/30 p-3 rounded-xl">
        <div className="flex justify-between">
          <span>Tổng trọng lượng đơn hàng:</span>
          <span className="font-bold text-rice-slate">{totalWeightKg.toFixed(1)} Kg</span>
        </div>
        <div className="flex justify-between">
          <span>Tạm tính tiền gạo:</span>
          <span className="font-bold text-rice-slate">{subtotalVnd.toLocaleString('vi-VN')} đ</span>
        </div>
        {discountVnd > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span className="flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Chiết khấu mua sỉ (Volume):
            </span>
            <span>-{discountVnd.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        <div className="flex justify-between border-t border-rice-green/20 pt-2 font-bold text-rice-slate">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-rice-green" /> Phí giao hàng xe tải/chuyển phát:
          </span>
          <span className={shippingFeeVnd === 0 ? 'text-emerald-600' : 'text-rice-slate'}>
            {shippingFeeVnd === 0 ? 'Miễn Phí Shipping' : `${shippingFeeVnd.toLocaleString('vi-VN')} đ`}
          </span>
        </div>
      </div>

      {/* Shipping Policy Note */}
      <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Chính sách Free Ship:</strong> Miễn phí vận chuyển cho đơn hàng mua trên <strong>100 Kg</strong> gạo hoặc tổng giá trị tiền đơn trên <strong>2.000.000 đ</strong>.
        </p>
      </div>
    </div>
  );
};
