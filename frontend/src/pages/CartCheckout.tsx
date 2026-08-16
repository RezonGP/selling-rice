import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CreditCard, QrCode, Truck, Scale, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WeightCalculator } from '../components/WeightCalculator';
import { apiClient } from '../api/client';

export const CartCheckout: React.FC = () => {
  const { items, totalWeightKg, subtotalVnd, discountVnd, shippingFeeVnd, totalVnd, removeFromCart, updateQuantity, clearCart, province } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    district: '',
    ward: '',
    streetAddress: '',
    isCorporateAddress: false,
    companyName: '',
    paymentMethod: 'COD',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccessCode, setOrderSuccessCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product._id,
          sizeKg: item.selectedSizeKg,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName.trim() || 'Khách Hàng Nông Sản Việt',
          phone: formData.phone.trim() || '0901234567',
          province: province || 'Hồ Chí Minh',
          district: formData.district.trim() || 'Chưa nhập quận',
          ward: formData.ward.trim() || 'Chưa nhập phường',
          streetAddress: formData.streetAddress.trim() || 'Địa chỉ giao hàng',
          isCorporateAddress: formData.isCorporateAddress,
          companyName: formData.companyName,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await apiClient.post('/orders', orderPayload);
      const createdOrder = res.data.data.order;
      setOrderSuccessCode(createdOrder.orderCode);
      clearCart();

      if (res.data.data.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const detailErrs = error.response.data.errors.map((e: any) => e.message).join(', ');
        setErrorMessage(`Lỗi nhập liệu: ${detailErrs}`);
      } else {
        setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccessCode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-rice-slate">Đặt Hàng Thành Công!</h1>
        <p className="text-sm text-gray-600">
          Mã đơn hàng gạo của bạn là: <strong className="text-rice-green font-mono text-base">{orderSuccessCode}</strong>
        </p>
        <div className="bg-rice-lightgreen/40 p-6 rounded-2xl border border-rice-green/20 text-xs text-left space-y-2">
          <p>• Đơn hàng đang được kho Nông Sản Việt tiến hành đo trọng lượng và đóng gói.</p>
          <p>• Nhân viên vận tải sẽ liên hệ xác nhận lộ trình trước khi giao hàng.</p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Link to={`/tracking?code=${orderSuccessCode}`} className="bg-rice-green text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
            Theo Dõi Tiến Độ Đơn Hàng
          </Link>
          <Link to="/products" className="bg-rice-cream text-rice-slate font-bold text-xs px-6 py-3 rounded-xl border border-gray-300">
            Tiếp Tục Mua Gạo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-rice-wood rounded-full flex items-center justify-center mx-auto text-rice-slate">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-rice-slate">Giỏ Hàng Gạo Đang Trống</h2>
        <p className="text-xs text-gray-500">Hãy chọn các sản phẩm gạo ST25, Gạo Lứt hoặc Gạo Hữu Cơ để thêm vào giỏ.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-rice-green text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
          <span>Khám Phá Danh Mục Gạo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold text-rice-slate tracking-tight flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-rice-green" />
        <span>Giỏ Hàng & Thanh Toán Đơn Gạo</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List & Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Table */}
          <div className="bg-white rounded-2xl border border-rice-green/20 overflow-hidden shadow-sm">
            <div className="bg-rice-lightgreen/50 px-5 py-3 border-b border-rice-green/20 flex items-center justify-between text-xs font-bold text-rice-slate">
              <span>Sản Phẩm Trong Giỏ ({items.length})</span>
              <span className="flex items-center gap-1 text-rice-green">
                <Scale className="w-4 h-4" /> Total: {totalWeightKg.toFixed(1)} Kg
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.selectedSizeKg}`} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200'}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl border"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-rice-slate line-clamp-1">{item.product.name}</h4>
                      <span className="text-[11px] text-gray-500 block">Quy cách: {item.unitName} ({item.selectedSizeKg} kg)</span>
                      <span className="text-xs font-extrabold text-rice-slate">
                        {item.priceVnd.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 border rounded-lg px-2 py-1 bg-rice-cream text-xs">
                      <button onClick={() => updateQuantity(item.product._id, item.selectedSizeKg, -1)} className="px-1 font-bold">-</button>
                      <span className="font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.selectedSizeKg, 1)} className="px-1 font-bold">+</button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id, item.selectedSizeKg)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Shipping Form */}
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="bg-white p-6 rounded-2xl border border-rice-green/20 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-rice-slate flex items-center gap-2 border-b pb-3">
              <Truck className="w-5 h-5 text-rice-green" />
              <span>Thông Tin Giao Hàng & Địa Chỉ Kho Bếp</span>
            </h3>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Họ và Tên Người Nhận *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Số Điện Thoại Nhận Hàng *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Quận / Huyện *</label>
                <input
                  type="text"
                  required
                  placeholder="Quận Tân Bình / Hoài Đức"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Phường / Xã *</label>
                <input
                  type="text"
                  required
                  placeholder="Phường 15"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-gray-600 block mb-1">Địa Chỉ Chi Tiết (Số nhà, Tên đường, Bếp ăn) *</label>
              <input
                type="text"
                required
                placeholder="123 Đường Cộng Hòa, Bếp ăn số 2"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3 py-2 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t space-y-3">
              <label className="text-xs font-extrabold text-rice-slate block uppercase tracking-wider">
                Phương Thức Thanh Toán:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-rice-green bg-rice-lightgreen/50 text-rice-green font-bold' : 'border-gray-200'}`}>
                  <input type="radio" name="pm" value="COD" checked={formData.paymentMethod === 'COD'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                  <span>COD (Tiền Mặt)</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-rice-green bg-rice-lightgreen/50 text-rice-green font-bold' : 'border-gray-200'}`}>
                  <input type="radio" name="pm" value="BANK_TRANSFER" checked={formData.paymentMethod === 'BANK_TRANSFER'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                  <QrCode className="w-4 h-4 text-rice-gold" />
                  <span>Chuyển Khoản QR</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${formData.paymentMethod === 'VNPAY' ? 'border-rice-green bg-rice-lightgreen/50 text-rice-green font-bold' : 'border-gray-200'}`}>
                  <input type="radio" name="pm" value="VNPAY" checked={formData.paymentMethod === 'VNPAY'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Ví VNPay / ATM</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Summary & Weight Calculator */}
        <div className="lg:col-span-5 space-y-6">
          <WeightCalculator />

          {/* Final Order Price Breakdown Card */}
          <div className="bg-rice-slate text-white p-6 rounded-2xl space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-rice-gold tracking-wide uppercase border-b border-gray-700 pb-3">
              Tổng Cộng Đơn Hàng Gạo
            </h4>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Tổng khối lượng:</span>
                <span className="font-bold text-white">{totalWeightKg.toFixed(1)} Kg</span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-white">{subtotalVnd.toLocaleString('vi-VN')} đ</span>
              </div>
              {discountVnd > 0 && (
                <div className="flex justify-between text-rice-gold font-bold">
                  <span>Chiết khấu sỉ (Volume):</span>
                  <span>-{discountVnd.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển ({province}):</span>
                <span className="font-bold text-white">{shippingFeeVnd === 0 ? 'MIỄN PHÍ' : `${shippingFeeVnd.toLocaleString('vi-VN')} đ`}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">Thành Tiền Thanh Toán:</span>
              <span className="text-2xl font-black text-rice-gold">
                {totalVnd.toLocaleString('vi-VN')} <span className="text-xs text-white font-normal">VNĐ</span>
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-rice-gold text-rice-slate font-black text-sm hover:bg-rice-gold/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-rice-slate" />
              <span>{submitting ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Đơn Gạo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
