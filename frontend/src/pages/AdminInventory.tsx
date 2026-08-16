import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Plus, X, AlertTriangle, PackageCheck } from 'lucide-react';
import { IProduct } from '../types';
import { apiClient } from '../api/client';

interface BatchItem {
  _id: string;
  batchNumber: string;
  productId: string | { _id: string; name: string };
  packagingSizeKg: number;
  packDate: string;
  expiryDate: string;
  remainingQuantityPackages: number;
  totalWeightKg: number;
  supplier: string;
  qualityGrade: string;
}

export const AdminInventory: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    productId: '',
    packagingSizeKg: 5,
    packDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    initialQuantityPackages: 100,
    supplier: 'HTX Nông Nghiệp Sóc Trăng',
    qualityGrade: 'Grade A+ Export',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchRes, prodRes, warnRes] = await Promise.allSettled([
        apiClient.get('/inventory/batches'),
        apiClient.get('/products'),
        apiClient.get('/inventory/warnings'),
      ]);

      if (batchRes.status === 'fulfilled') setBatches(batchRes.value.data.data);
      if (prodRes.status === 'fulfilled') {
        const prodList = prodRes.value.data.data;
        setProducts(prodList);
        if (prodList.length > 0 && !formData.productId) {
          setFormData((prev) => ({ ...prev, productId: prodList[0]._id }));
        }
      }
      if (warnRes.status === 'fulfilled') setWarnings(warnRes.value.data.data || []);
    } catch {
      // fallback handled cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const randomBatch = `BATCH-${new Date().toISOString().slice(0, 7).replace('-', '')}-ST25-${Math.floor(10 + Math.random() * 90)}`;

    setFormData({
      batchNumber: randomBatch,
      productId: products[0]?._id || '',
      packagingSizeKg: 5,
      packDate: today,
      expiryDate: nextYear,
      initialQuantityPackages: 100,
      supplier: 'HTX Nông Nghiệp Sóc Trăng',
      qualityGrade: 'Grade A+ Export',
      notes: '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      await apiClient.post('/inventory/batches', formData);
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setFormError(err.response.data.errors.map((e: any) => e.message).join(' · '));
      } else {
        setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi nhập lô.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rice-cream">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rice-slate">Quản Lý Kho Lô Đóng Gói (Batch Tracking)</h1>
            <p className="text-xs text-gray-500 mt-0.5">Theo dõi ngày đóng gói, hạn sử dụng và cảnh báo tồn kho tự động.</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-rice-green text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow hover:bg-rice-green/90 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Nhập Lô Đóng Gói Mới
          </button>
        </div>

        {/* Warnings Banner */}
        {warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-800 text-xs">Cảnh Báo Tồn Kho Thấp!</h4>
              <p className="text-amber-700 text-xs">
                {warnings.map((w: any) => `${w.productName} (${w.packagingSizeKg}kg): còn ${w.currentStock} bao`).join(' | ')}
              </p>
            </div>
          </div>
        )}

        {/* Batches Table */}
        <div className="bg-white rounded-2xl border border-rice-green/20 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-rice-slate text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Mã Lô Đóng Gói</th>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Quy Cách</th>
                <th className="p-4">Ngày Đóng Gói</th>
                <th className="p-4">Hạn Sử Dụng</th>
                <th className="p-4">Số Bao Còn Lại</th>
                <th className="p-4">Tổng Trọng Lượng</th>
                <th className="p-4">Nhà Cung Cấp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Đang tải dữ liệu kho...</td></tr>
              ) : batches.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Chưa có lô đóng gói nào trong kho.</td></tr>
              ) : (
                batches.map((b) => {
                  const prodName = typeof b.productId === 'object' ? b.productId?.name : 'Sản Phẩm Gạo';
                  return (
                    <tr key={b._id} className="hover:bg-rice-cream/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-rice-green">{b.batchNumber}</td>
                      <td className="p-4 font-bold text-rice-slate">{prodName}</td>
                      <td className="p-4 font-bold">{b.packagingSizeKg} Kg</td>
                      <td className="p-4">{new Date(b.packDate).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 text-emerald-600 font-bold">{new Date(b.expiryDate).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 font-bold">{b.remainingQuantityPackages} Bao</td>
                      <td className="p-4 font-black text-rice-slate">{b.totalWeightKg || b.remainingQuantityPackages * b.packagingSizeKg} Kg</td>
                      <td className="p-4 text-gray-500">{b.supplier}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Add Batch Modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-rice-green" />
                <h3 className="text-base font-black text-rice-slate">Nhập Lô Đóng Gói Kho Mới</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveBatch} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Mã Lô Đóng Gói *</label>
                <input
                  required type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Chọn Sản Phẩm *</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 font-bold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Quy Cách (Kg) *</label>
                  <select
                    value={formData.packagingSizeKg}
                    onChange={(e) => setFormData({ ...formData, packagingSizeKg: parseInt(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl p-2 font-bold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  >
                    <option value={5}>Túi 5kg</option>
                    <option value={10}>Túi 10kg</option>
                    <option value={25}>Bao 25kg</option>
                    <option value={50}>Bao 50kg Sỉ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Số Bao Nhập Kho *</label>
                  <input
                    required type="number" min={1}
                    value={formData.initialQuantityPackages}
                    onChange={(e) => setFormData({ ...formData, initialQuantityPackages: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-xl p-2 font-bold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Ngày Đóng Gói *</label>
                  <input
                    required type="date"
                    value={formData.packDate}
                    onChange={(e) => setFormData({ ...formData, packDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Hạn Sử Dụng *</label>
                  <input
                    required type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Nhà Cung Cấp / Hợp Tác Xã *</label>
                <input
                  required type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Phân Loại Chất Lượng</label>
                <input
                  type="text"
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-rice-green text-white font-bold rounded-xl hover:bg-rice-green/90 disabled:opacity-60">
                  {saving ? 'Đang lưu...' : 'Tạo Lô Đóng Gói'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
