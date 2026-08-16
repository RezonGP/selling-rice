import React from 'react';
import { Wheat, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-rice-slate text-white border-t border-rice-green/30 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rice-gold rounded-xl flex items-center justify-center text-rice-slate font-bold">
                <Wheat className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">Nông Sản Việt</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Hệ thống cung ứng Gạo ST25 chính hãng và nông sản sạch hàng đầu Việt Nam. Đáp ứng đầy đủ quy chuẩn xuất khẩu ISO 22000 & HACCP.
            </p>
            <div className="flex items-center space-x-2 text-rice-gold text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Gạo Thơm Ngon Nhất Thế Giới</span>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-sm font-bold text-rice-gold tracking-wider uppercase mb-4">Sản Phẩm Nổi Bật</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Gạo ST25 Lúa Tôm Sóc Trăng</li>
              <li className="hover:text-white transition-colors cursor-pointer">Gạo Lứt Đỏ Điện Biên Giảm Cân</li>
              <li className="hover:text-white transition-colors cursor-pointer">Gạo Hữu Cơ Eco Campuchia / Long An</li>
              <li className="hover:text-white transition-colors cursor-pointer">Gạo Nếp Cái Hoa Vàng</li>
              <li className="hover:text-white transition-colors cursor-pointer">Gạo Cung Cấp Cho Nhà Hàng (Giá Sỉ)</li>
            </ul>
          </div>

          {/* B2B Services */}
          <div>
            <h4 className="text-sm font-bold text-rice-gold tracking-wider uppercase mb-4">Dịch Vụ B2B & Đại Lý</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rice-green" />
                <span>Chiết khấu tự động theo Kg | Tấn</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rice-green" />
                <span>Giao hàng xe tải tận kho bếp ăn</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rice-green" />
                <span>Xuất hóa đơn VAT & Chứng nhận CO/CQ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rice-green" />
                <span>Đóng bao 25kg / 50kg in thương hiệu</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-rice-gold tracking-wider uppercase mb-4">Liên Hệ Trực Tiếp</h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rice-gold" />
                <span>Hotline Sỉ & Lẻ: 028 66750525</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rice-gold" />
                <span>Email: pnam04010@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-rice-gold flex-shrink-0 mt-0.5" />
                <span>Tổng kho 1: 99/1 phan anh, Phường: bình trị đông, Quận: Tân Phu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/60 mt-12 pt-6 text-center text-xs text-gray-400">
          <p>© 2026 Nông Sản Việt . Sản xuất và phân phối Gạo Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
};
