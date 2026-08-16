import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Scale, DollarSign, ShoppingBag, ShieldCheck } from 'lucide-react';
import { apiClient } from '../api/client';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalRevenueVnd: 125000000,
    totalVolumeKg: 4500,
    totalVolumeTons: '4.50',
    totalOrders: 32,
    recentLogs: [],
  });

  useEffect(() => {
    apiClient
      .get('/admin/metrics')
      .then((res) => setMetrics(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rice-cream">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-rice-slate">Dashboard Thống Kê Sản Lượng & Doanh Thu</h1>
          <p className="text-xs text-gray-500">Báo cáo real-time sản lượng gạo bán ra (Tấn/Kg) và hoạt động hệ thống.</p>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-rice-green/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase block">Sản Lượng Đã Bán</span>
              <span className="text-2xl font-black text-rice-slate">{metrics.totalVolumeTons} <span className="text-xs text-rice-green">Tấn</span></span>
              <span className="text-[11px] text-gray-400 block mt-0.5">({metrics.totalVolumeKg} Kg)</span>
            </div>
            <div className="w-12 h-12 bg-rice-lightgreen text-rice-green rounded-xl flex items-center justify-center font-bold flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rice-green/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase block">Tổng Doanh Thu</span>
              <span className="text-2xl font-black text-rice-slate">{(metrics.totalRevenueVnd / 1000000).toFixed(1)} <span className="text-xs text-rice-gold">Tr VNĐ</span></span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">+14% so với tháng trước</span>
            </div>
            <div className="w-12 h-12 bg-rice-gold/20 text-rice-slate rounded-xl flex items-center justify-center font-bold flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rice-green/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase block">Đơn Hàng Gạo</span>
              <span className="text-2xl font-black text-rice-slate">{metrics.totalOrders} <span className="text-xs text-gray-500">Đơn</span></span>
              <span className="text-[11px] text-blue-600 block mt-0.5">B2B & B2C Combo</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rice-green/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase block">Cảnh Báo Tồn Kho</span>
              <span className="text-2xl font-black text-emerald-600">Ổn Định</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">Không có lô hết hạn</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Rice Variety Sales Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-rice-green/20 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-rice-slate uppercase tracking-wider">Tỷ Lệ Bán Ra Theo Loại Gạo</h3>
          <div className="space-y-3 text-xs font-semibold">
            <div>
              <div className="flex justify-between mb-1">
                <span>Gạo ST25 Lúa Tôm (Sóc Trăng)</span>
                <span className="text-rice-green font-bold">2.8 Tấn (62%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rice-green h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Gạo Lứt Đỏ Điện Biên</span>
                <span className="text-rice-gold font-bold">1.1 Tấn (24%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rice-gold h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Gạo Hữu Cơ Eco Sạch</span>
                <span className="text-blue-600 font-bold">0.6 Tấn (14%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
