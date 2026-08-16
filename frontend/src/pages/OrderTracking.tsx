import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, Scale, RotateCcw, AlertCircle } from 'lucide-react';
import { IOrder } from '../types';
import { apiClient } from '../api/client';
import { useCart } from '../context/CartContext';

export const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(searchParams.get('code') || '');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  const fetchOrder = (code: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/orders/track/${code}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setError('Không tìm thấy đơn hàng gạo với mã đã nhập!'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      fetchOrder(codeParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderCode);
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.productId,
          code: item.productId,
          name: item.productName,
          slug: item.productId,
          category: 'Gạo Đặc Sản ST' as any,
          description: '',
          images: [],
          characteristics: { stickiness: 5, aroma: 5, softness: 5, chalkiness: 1, grainLengthMm: 7, originRegion: 'Miền Tây', harvestSeason: 'Mới' },
          packagingOptions: [{ sizeKg: item.packagingSizeKg, unitName: item.unitName, priceVnd: item.priceVnd, stockQuantity: 100, isAvailable: true }],
          tieredDiscounts: [],
          isFeatured: false,
          isB2BAvailable: true,
          isActive: true,
          ratingAverage: 5,
          ratingCount: 1,
        },
        item.packagingSizeKg,
        item.quantity
      );
    });
    alert(`Đã thêm toàn bộ ${order.items.length} món gạo từ đơn cũ #${order.orderCode} vào giỏ hàng!`);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Chờ Tiếp Nhận', bg: 'bg-amber-100 text-amber-800 border-amber-300', stepIndex: 1 };
      case 'PROCESSING':
        return { label: 'Đang Đóng Gói Kho', bg: 'bg-blue-100 text-blue-800 border-blue-300', stepIndex: 2 };
      case 'SHIPPED':
        return { label: 'Đang Vận Chuyển Xe Tải', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', stepIndex: 3 };
      case 'COMPLETED':
        return { label: 'Đã Giao Thành Công', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', stepIndex: 4 };
      case 'CANCELLED':
        return { label: 'Đã Hủy Đơn', bg: 'bg-red-100 text-red-800 border-red-300', stepIndex: 0 };
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-700 border-gray-300', stepIndex: 1 };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-rice-slate tracking-tight flex items-center justify-center gap-2">
          <Truck className="w-8 h-8 text-rice-green" />
          <span>Theo Dõi Vận Đơn Gạo Realtime</span>
        </h1>
        <p className="text-xs text-gray-500">Nhập mã đơn hàng (Ví dụ: RICE-20260816-2896) để xem tiến độ giao xe tải.</p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Nhập mã đơn hàng RICE-..."
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            className="w-full bg-white border border-rice-green/30 rounded-xl pl-10 pr-4 py-3 text-xs font-mono font-bold text-rice-slate shadow-sm focus:ring-2 focus:ring-rice-green uppercase"
          />
        </div>
        <button
          type="submit"
          className="bg-rice-green text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-rice-green/90 transition-colors"
        >
          Tra Cứu
        </button>
      </form>

      {/* Results */}
      {loading && <div className="text-center text-xs font-bold text-gray-400 py-10">Đang truy vấn trạng thái vận đơn...</div>}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-xs font-semibold border border-red-200">
          {error}
        </div>
      )}

      {order && (() => {
        const statusInfo = getStatusDisplay(order.orderStatus);
        const currentStep = statusInfo.stepIndex;

        return (
          <div className="bg-white rounded-2xl border border-rice-green/20 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Mã Đơn Hàng</span>
                <span className="text-lg font-black text-rice-slate font-mono">{order.orderCode}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`border text-xs font-extrabold px-3.5 py-1 rounded-full ${statusInfo.bg}`}>
                  {statusInfo.label}
                </span>
                <button
                  onClick={handleReorder}
                  className="flex items-center gap-1 text-xs bg-rice-gold text-rice-slate font-bold px-3 py-1.5 rounded-lg hover:bg-rice-gold/80"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt Lại Đơn Cũ</span>
                </button>
              </div>
            </div>

            {/* Logistics Dynamic Progress Timeline */}
            {order.orderStatus === 'CANCELLED' ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span>Đơn hàng đã bị hủy. Vui lòng liên hệ Hotline 028 66750525 để được hỗ trợ.</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold py-4 border-b">
                {/* Step 1 */}
                <div className="space-y-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-sm transition-all ${
                    currentStep >= 1 ? 'bg-rice-green text-white font-bold ring-4 ring-rice-green/20' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className={`block text-[11px] ${currentStep >= 1 ? 'text-rice-slate font-bold' : 'text-gray-400'}`}>
                    Chờ Tiếp Nhận
                  </span>
                </div>

                {/* Step 2 */}
                <div className="space-y-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-sm transition-all ${
                    currentStep >= 2 ? 'bg-rice-green text-white font-bold ring-4 ring-rice-green/20' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <span className={`block text-[11px] ${currentStep >= 2 ? 'text-rice-slate font-bold' : 'text-gray-400'}`}>
                    Đóng Gói Lô
                  </span>
                </div>

                {/* Step 3 */}
                <div className="space-y-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-sm transition-all ${
                    currentStep >= 3 ? 'bg-rice-green text-white font-bold ring-4 ring-rice-green/20' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className={`block text-[11px] ${currentStep >= 3 ? 'text-rice-slate font-bold' : 'text-gray-400'}`}>
                    Đang Vận Chuyển
                  </span>
                </div>

                {/* Step 4 */}
                <div className="space-y-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-sm transition-all ${
                    currentStep >= 4 ? 'bg-emerald-600 text-white font-bold ring-4 ring-emerald-600/30' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className={`block text-[11px] ${currentStep >= 4 ? 'text-emerald-700 font-extrabold' : 'text-gray-400'}`}>
                    Đã Giao Bếp
                  </span>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 bg-rice-cream p-4 rounded-xl">
                <h4 className="font-bold text-rice-slate flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-rice-green" /> Trọng Lượng & Vận Chuyển:
                </h4>
                <p>• Tổng trọng lượng: <strong>{order.totalWeightKg} Kg</strong></p>
                <p>• Đơn vị vận tải: <strong>{order.shippingCarrier || 'Xe Tải Nông Sản Việt'}</strong></p>
                <p>• Mã vận đơn: <strong>{order.carrierTrackingCode || 'VTP-98231200'}</strong></p>
              </div>

              <div className="space-y-2 bg-rice-cream p-4 rounded-xl">
                <h4 className="font-bold text-rice-slate">Địa Chỉ Giao Kho Bếp:</h4>
                <p>• Người nhận: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})</p>
                <p>• Địa chỉ: {order.shippingAddress.streetAddress}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
