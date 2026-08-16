import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Save, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { IProduct, RiceCategory } from '../types';
import { apiClient } from '../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductForm {
  code: string;
  name: string;
  category: RiceCategory;
  description: string;
  originRegion: string;
  harvestSeason: string;
  imageUrl: string;
  price5kg: number;
  price10kg: number;
  price25kg: number;
  price50kg: number;
  isFeatured: boolean;
  isB2BAvailable: boolean;
}

const SAMPLE_IMAGES = [
  { label: 'Gạo ST25', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Gạo Lứt Red', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800' },
  { label: 'Gạo Hữu Cơ', url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800' },
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800';

const EMPTY_FORM: ProductForm = {
  code: '',
  name: '',
  category: RiceCategory.SPECIALTY,
  description: '',
  originRegion: 'Sóc Trăng',
  harvestSeason: 'Đông Xuân 2026',
  imageUrl: DEFAULT_IMAGE,
  price5kg: 195000,
  price10kg: 380000,
  price25kg: 920000,
  price50kg: 1800000,
  isFeatured: false,
  isB2BAvailable: true,
};

// ─── Component ────────────────────────────────────────────────────────────────
export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<ProductForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products');
      setProducts(res.data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setFormError(null);
    setFormData({
      code: p.code,
      name: p.name,
      category: p.category,
      description: p.description,
      originRegion: p.characteristics?.originRegion || '',
      harvestSeason: p.characteristics?.harvestSeason || '',
      imageUrl: p.images?.[0] || DEFAULT_IMAGE,
      price5kg: p.packagingOptions?.find((o) => o.sizeKg === 5)?.priceVnd || 0,
      price10kg: p.packagingOptions?.find((o) => o.sizeKg === 10)?.priceVnd || 0,
      price25kg: p.packagingOptions?.find((o) => o.sizeKg === 25)?.priceVnd || 0,
      price50kg: p.packagingOptions?.find((o) => o.sizeKg === 50)?.priceVnd || 0,
      isFeatured: p.isFeatured || false,
      isB2BAvailable: p.isB2BAvailable ?? true,
    });
    setShowModal(true);
  };

  const buildPayload = () => ({
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    category: formData.category,
    description: formData.description.trim(),
    images: [formData.imageUrl.trim() || DEFAULT_IMAGE],
    characteristics: {
      stickiness: 5, aroma: 5, softness: 5,
      originRegion: formData.originRegion.trim(),
      harvestSeason: formData.harvestSeason.trim(),
    },
    packagingOptions: [
      { sizeKg: 5,  unitName: 'Túi 5kg',    priceVnd: formData.price5kg,  stockQuantity: 100, isAvailable: true },
      { sizeKg: 10, unitName: 'Túi 10kg',   priceVnd: formData.price10kg, stockQuantity: 100, isAvailable: true },
      { sizeKg: 25, unitName: 'Bao 25kg',   priceVnd: formData.price25kg, stockQuantity: 50,  isAvailable: true },
      { sizeKg: 50, unitName: 'Bao 50kg Sỉ',priceVnd: formData.price50kg, stockQuantity: 30,  isAvailable: true },
    ],
    isFeatured: formData.isFeatured,
    isB2BAvailable: formData.isB2BAvailable,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct._id}`, buildPayload());
      } else {
        await apiClient.post('/products', buildPayload());
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setFormError(err.response.data.errors.map((e: any) => e.message).join(' · '));
      } else {
        setFormError(err.response?.data?.message || 'Có lỗi xảy ra.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/products/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      alert('Lỗi khi xóa sản phẩm. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const f = (n: number) => n ? n.toLocaleString('vi-VN') + ' đ' : 'N/A';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rice-cream">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rice-slate">Quản Lý Danh Mục & Quy Cách Gạo</h1>
            <p className="text-xs text-gray-500 mt-0.5">Thêm / Sửa / Xóa sản phẩm gạo, hình ảnh và bảng giá quy cách đóng gói.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-rice-green text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow hover:bg-rice-green/90 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Thêm Loại Gạo Mới
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-rice-green/20 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-rice-slate text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Hình Ảnh</th>
                <th className="p-4">Mã SKU / Tên Gạo</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Xuất Xứ</th>
                <th className="p-4">Túi 5kg</th>
                <th className="p-4">Bao 50kg</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Đang tải...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Chưa có sản phẩm nào.</td></tr>
              ) : products.map((p) => {
                const pkg5  = p.packagingOptions?.find((o) => o.sizeKg === 5);
                const pkg50 = p.packagingOptions?.find((o) => o.sizeKg === 50);
                const img = p.images?.[0] || DEFAULT_IMAGE;
                return (
                  <tr key={p._id} className="hover:bg-rice-cream/40 transition-colors">
                    <td className="p-3">
                      <img
                        src={img}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-rice-green/20 shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-bold text-rice-slate">
                      <span className="font-mono text-rice-green block text-[11px]">{p.code}</span>
                      {p.name}
                    </td>
                    <td className="p-4 text-xs">{p.category}</td>
                    <td className="p-4 text-xs">{p.characteristics?.originRegion || '—'}</td>
                    <td className="p-4 font-bold text-xs">{f(pkg5?.priceVnd ?? 0)}</td>
                    <td className="p-4 font-bold text-rice-gold text-xs">{f(pkg50?.priceVnd ?? 0)}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Hoạt Động
                      </span>
                      {p.isFeatured && (
                        <span className="ml-1 bg-rice-gold/20 text-rice-slate text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Nổi Bật
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3 h-3" /> Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-rice-slate">
                {editingProduct ? `✏️ Sửa: ${editingProduct.name}` : '➕ Thêm Sản Phẩm Gạo Mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              {/* Row: Code + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Mã SKU *</label>
                  <input
                    required type="text" placeholder="ST25-PREMIUM"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Danh Mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RiceCategory })}
                    className="w-full border border-gray-200 rounded-xl p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  >
                    {Object.values(RiceCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold block mb-1">Tên Gạo *</label>
                <input
                  required type="text" placeholder="Gạo ST25 Lúa Tôm Thượng Hạng"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 font-bold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                />
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="font-bold block mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-rice-green" /> Hình Ảnh Sản Phẩm (URL)
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={formData.imageUrl || DEFAULT_IMAGE}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                    />
                    <div className="flex gap-1.5">
                      <span className="text-[10px] text-gray-400 font-semibold self-center">Chọn nhanh:</span>
                      {SAMPLE_IMAGES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: sample.url })}
                          className="bg-gray-100 hover:bg-rice-green/10 hover:text-rice-green text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold block mb-1">Mô Tả *</label>
                <textarea
                  required rows={3}
                  placeholder="Đặc tính thơm dẻo, xuất xứ, chứng nhận chất lượng..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                />
              </div>

              {/* Origin + Season */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Vùng Xuất Xứ</label>
                  <input
                    type="text" placeholder="Sóc Trăng"
                    value={formData.originRegion}
                    onChange={(e) => setFormData({ ...formData, originRegion: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Vụ Thu Hoạch</label>
                  <input
                    type="text" placeholder="Đông Xuân 2026"
                    value={formData.harvestSeason}
                    onChange={(e) => setFormData({ ...formData, harvestSeason: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                  />
                </div>
              </div>

              {/* Prices */}
              <p className="font-bold text-rice-slate pt-1 border-t">Bảng Giá Theo Quy Cách Đóng Gói (đ)</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Túi 5kg', key: 'price5kg' },
                  { label: 'Túi 10kg', key: 'price10kg' },
                  { label: 'Bao 25kg', key: 'price25kg' },
                  { label: 'Bao 50kg (Sỉ)', key: 'price50kg' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="font-bold block mb-1">{label}</label>
                    <input
                      type="number" min={0}
                      value={(formData as any)[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-xl p-2 font-bold focus:outline-none focus:ring-2 focus:ring-rice-green/40"
                    />
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-rice-green"
                  />
                  <span className="font-semibold">Hiển Thị Nổi Bật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isB2BAvailable}
                    onChange={(e) => setFormData({ ...formData, isB2BAvailable: e.target.checked })}
                    className="w-4 h-4 accent-rice-green"
                  />
                  <span className="font-semibold">Cho Phép Báo Giá Sỉ B2B</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-rice-green text-white font-bold rounded-xl hover:bg-rice-green/90 disabled:opacity-60">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Đang lưu...' : editingProduct ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-sm shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-black text-base">Xác nhận xóa sản phẩm</h3>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Bạn có chắc muốn xóa sản phẩm{' '}
              <span className="font-bold text-rice-slate">"{deleteTarget.name}"</span>?
              <br />Sản phẩm sẽ bị ẩn khỏi danh mục (có thể khôi phục từ database).
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-xs hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 disabled:opacity-60">
                {deleting ? 'Đang xóa...' : '🗑 Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
