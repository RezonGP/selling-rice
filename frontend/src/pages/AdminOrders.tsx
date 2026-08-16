import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Printer, Eye, X, CheckCircle, Truck, XCircle } from 'lucide-react';
import { IOrder } from '../types';
import { apiClient } from '../api/client';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/orders/admin/all');
      setOrders(res.data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: status as any } : null));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái đơn hàng.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Chờ Xử Lý</span>;
      case 'PROCESSING':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Đang Đóng Gói</span>;
      case 'SHIPPED':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Đang Giao Xe</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Hoàn Thành</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Đã Hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rice-cream">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-x-hidden">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-rice-slate">Quản Lý Đơn Hàng & Xuất Kho Giao Xe Tải</h1>
          <p className="text-xs text-gray-500 mt-0.5">Duyệt đơn, in phiếu xuất kho và gán mã vận đơn giao nhận.</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-rice-green/20 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-rice-slate text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Mã Đơn Hàng</th>
                <th className="p-4">Khách Hàng / ĐT</th>
                <th className="p-4">Trọng Lượng</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">Đang tải danh sách đơn hàng...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">Chưa có đơn hàng nào.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-rice-cream/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-rice-green block">{o.orderCode}</span>
                      {o.isB2BOrder && (
                        <span className="bg-rice-gold/20 text-rice-slate text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Đơn Sỉ B2B
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-rice-slate">
                      {o.shippingAddress.fullName}
                      <span className="block font-mono text-[11px] text-gray-400 font-normal">{o.shippingAddress.phone}</span>
                    </td>
                    <td className="p-4 font-black text-rice-slate">{o.totalWeightKg} Kg</td>
                    <td className="p-4 font-extrabold text-rice-gold">{o.totalVnd.toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 font-bold">
                      {o.paymentMethod}
                      <span className="block text-[10px] text-gray-400 font-normal">{o.paymentStatus}</span>
                    </td>
                    <td className="p-4">{getStatusBadge(o.orderStatus)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Chi Tiết
                        </button>
                        {o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(o._id, 'SHIPPED')}
                            className="flex items-center gap-1 bg-rice-green text-white hover:bg-rice-green/90 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Truck className="w-3 h-3" /> Giao Xe
                          </button>
                        )}
                        {o.orderStatus === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateStatus(o._id, 'COMPLETED')}
                            className="flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Đã Giao
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Order Detail Modal ─────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-rice-slate">Chi Tiết Đơn Hàng: {selectedOrder.orderCode}</h3>
                <p className="text-gray-400 text-[11px]">Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery */}
            <div className="grid grid-cols-2 gap-4 bg-rice-cream/50 p-4 rounded-2xl">
              <div>
                <h4 className="font-bold text-rice-slate mb-1">Thông Tin Giao Hàng</h4>
                <p className="font-bold">{selectedOrder.shippingAddress.fullName}</p>
                <p className="font-mono text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-gray-600 mt-1">
                  {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.ward},{' '}
                  {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-rice-slate mb-1">Thanh Toán & Vận Chuyển</h4>
                <p><span className="text-gray-500">Hình thức:</span> <strong>{selectedOrder.paymentMethod}</strong></p>
                <p><span className="text-gray-500">Trạng thái TT:</span> <strong>{selectedOrder.paymentStatus}</strong></p>
                <p><span className="text-gray-500">Đơn vị VC:</span> <strong>{selectedOrder.shippingCarrier || 'Xe Tải Nông Sản Việt'}</strong></p>
                <p><span className="text-gray-500">Trạng thái đơn:</span> {getStatusBadge(selectedOrder.orderStatus)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-bold text-rice-slate mb-2">Danh Sách Mặt Hàng</h4>
              <table className="w-full text-left text-xs border rounded-xl overflow-hidden">
                <thead className="bg-gray-50 font-bold text-gray-600">
                  <tr>
                    <th className="p-2.5">Sản Phẩm</th>
                    <th className="p-2.5">Quy Cách</th>
                    <th className="p-2.5">Số Lượng</th>
                    <th className="p-2.5">Đơn Giá</th>
                    <th className="p-2.5 text-right">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold">{item.productName}</td>
                      <td className="p-2.5">{item.packagingSizeKg} kg</td>
                      <td className="p-2.5 font-bold">{item.quantity}</td>
                      <td className="p-2.5">{item.priceVnd.toLocaleString('vi-VN')} đ</td>
                      <td className="p-2.5 text-right font-bold text-rice-gold">
                        {(item.quantity * item.priceVnd).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t pt-3 space-y-1 text-right">
              <p><span className="text-gray-500">Tạm tính:</span> {selectedOrder.subtotalVnd.toLocaleString('vi-VN')} đ</p>
              {selectedOrder.discountVnd > 0 && (
                <p className="text-emerald-600"><span className="text-gray-500">Chiết khấu:</span> -{selectedOrder.discountVnd.toLocaleString('vi-VN')} đ</p>
              )}
              <p><span className="text-gray-500">Phí vận chuyển:</span> {selectedOrder.shippingFeeVnd.toLocaleString('vi-VN')} đ</p>
              <p className="text-base font-black text-rice-gold pt-1">
                Tổng Tiền: {selectedOrder.totalVnd.toLocaleString('vi-VN')} đ
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-3">
              <button
                onClick={() => alert(`Đã in phiếu kho cho đơn ${selectedOrder.orderCode}`)}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold px-3 py-2 rounded-xl"
              >
                <Printer className="w-4 h-4" /> In Phiếu Xuất Kho
              </button>

              <div className="flex gap-2">
                {selectedOrder.orderStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'CANCELLED')}
                    className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    <XCircle className="w-4 h-4" /> Hủy Đơn
                  </button>
                )}
                {selectedOrder.orderStatus === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'PROCESSING')}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Xác Nhận Đóng Gói
                  </button>
                )}
                {selectedOrder.orderStatus === 'PROCESSING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'SHIPPED')}
                    className="bg-rice-green text-white hover:bg-rice-green/90 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Duyệt Giao Xe
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
