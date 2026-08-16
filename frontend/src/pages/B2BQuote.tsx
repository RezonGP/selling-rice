import React, { useState } from 'react';
import { Building2, Send, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { apiClient } from '../api/client';

export const B2BQuote: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    riceVarietyNeeded: 'Gạo ST25 Lúa Tôm (Chuyên Nhà Hàng)',
    estimatedMonthlyVolumeTons: 2,
    preferredPackaging: 'Bao 50kg Tiêu Chuẩn Xuất Khẩu',
    deliveryLocation: 'TP. Hồ Chí Minh',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/b2b/quote-request', formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đăng ký báo giá sỉ!');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-rice-slate">Đã Gửi Yêu Cầu Báo Giá Sỉ B2B!</h1>
        <p className="text-sm text-gray-600">
          Cảm ơn quý doanh nghiệp <strong>{formData.companyName}</strong>. Chuyên viên kinh doanh nông sản sẽ gửi bảng báo giá theo Tấn kèm mẫu thử gạo tận nơi trong vòng 2 giờ làm việc.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-rice-gold/20 text-rice-slate font-extrabold text-xs px-3.5 py-1 rounded-full border border-rice-gold/40">
          <Building2 className="w-4 h-4 text-rice-slate" />
          <span>Kênh Cung Ứng Gạo Khối Lượng Lớn Dành Cho Doanh Nghiệp</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-rice-slate tracking-tight">
          Đăng Ký Nhận Báo Giá Sỉ Gạo Theo Tấn & Hợp Đồng B2B
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
          Chiết khấu tối đa cho Nhà hàng, Chuỗi quán ăn, Khách sạn, Bếp ăn công nghiệp và Đại lý phân phối.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-rice-green/20 shadow-lg space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Tên Công Ty / Doanh Nghiệp / Quán Ăn *</label>
            <input
              type="text"
              required
              placeholder="Công ty TNHH Bếp Ăn Sài Gòn"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Mã Số Thuế (MST) *</label>
            <input
              type="text"
              required
              placeholder="0312345678"
              value={formData.vatNumber}
              onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Người Đại Diện Phụ Trách Mua Hàng *</label>
            <input
              type="text"
              required
              placeholder="Anh Trần Văn B (Bếp Trưởng / Trưởng Mua Hàng)"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Số Điện Thoại Trực Tiếp *</label>
            <input
              type="tel"
              required
              placeholder="0988123456"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Email Nhận Báo Giá *</label>
            <input
              type="email"
              required
              placeholder="bep.muahang@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Sản Phẩm Gạo Cần Báo Giá *</label>
            <select
              value={formData.riceVarietyNeeded}
              onChange={(e) => setFormData({ ...formData, riceVarietyNeeded: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rice-slate"
            >
              <option value="Gạo ST25 Lúa Tôm (Chuyên Nhà Hàng)">Gạo ST25 Lúa Tôm (Chuyên Nhà Hàng Thượng Hạng)</option>
              <option value="Gạo Lứt Đỏ Điện Biên Giảm Cân">Gạo Lứt Đỏ Điện Biên (Chuyên Suất Ăn Healthy)</option>
              <option value="Gạo Hữu Cơ Eco Sạch">Gạo Hữu Cơ Eco Sạch (Trường Học / Bệnh Viện)</option>
              <option value="Gạo Hằng Ngày Giá Sỉ">Gạo Hằng Ngày Nở Xốp Vừa (Bếp Ăn Công Nghiệp)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Sản Lượng Dự Kiến (Tấn / Tháng) *</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              required
              value={formData.estimatedMonthlyVolumeTons}
              onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolumeTons: parseFloat(e.target.value) })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rice-slate focus:ring-2 focus:ring-rice-green"
            />
          </div>

          <div>
            <label className="font-bold text-rice-slate block mb-1.5">Quy Cách Đóng Bao Mong Muốn *</label>
            <select
              value={formData.preferredPackaging}
              onChange={(e) => setFormData({ ...formData, preferredPackaging: e.target.value })}
              className="w-full bg-rice-cream border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rice-slate"
            >
              <option value="Bao 50kg Tiêu Chuẩn Xuất Khẩu">Bao 50kg Tiêu Chuẩn Xuất Khẩu</option>
              <option value="Bao 25kg Tiện Lợi Bếp Ăn">Bao 25kg Tiện Lợi Bếp Ăn</option>
              <option value="Túi 5kg / 10kg In Logo Thương Hiệu">Túi 5kg / 10kg In Logo Thương Hiệu</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-rice-green text-white font-black text-sm hover:bg-rice-green/90 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-rice-gold" />
          <span>{submitting ? 'Đang Gửi Đăng Ký...' : 'Gửi Đăng Ký Nhận Báo Giá Sỉ B2B'}</span>
        </button>
      </form>
    </div>
  );
};
