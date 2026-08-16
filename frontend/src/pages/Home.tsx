import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wheat, ShieldCheck, Truck, Award, Building2, ChevronRight, Scale, ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { IProduct } from '../types';
import { apiClient } from '../api/client';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/products?isFeatured=true')
      .then((res) => {
        setFeaturedProducts(res.data.data);
      })
      .catch(() => {
        // Fallback mock data for immediate demonstration
        setFeaturedProducts([
          {
            _id: 'mock-1',
            code: 'ST25-PREMIUM',
            name: 'Gạo ST25 Lúa Tôm Thơm Thượng Hạng',
            slug: 'gao-st25-lua-tom',
            category: 'Gạo Đặc Sản ST' as any,
            description: 'Gạo ST25 chính hiệu Sóc Trăng hạt dài trắng ngần, dẻo thơm nhiều, vị ngọt tự nhiên.',
            images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=600'],
            characteristics: { stickiness: 5, aroma: 5, softness: 5, chalkiness: 1, grainLengthMm: 7.5, originRegion: 'Sóc Trăng', harvestSeason: 'Đông Xuân 2026' },
            packagingOptions: [
              { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 195000, stockQuantity: 50, isAvailable: true },
              { sizeKg: 10, unitName: 'Túi 10kg', priceVnd: 380000, stockQuantity: 40, isAvailable: true },
              { sizeKg: 25, unitName: 'Bao 25kg', priceVnd: 920000, stockQuantity: 20, isAvailable: true },
              { sizeKg: 50, unitName: 'Bao 50kg Sỉ', priceVnd: 1800000, stockQuantity: 10, isAvailable: true },
            ],
            tieredDiscounts: [{ minQuantityKg: 100, discountPercentage: 10 }],
            isFeatured: true,
            isB2BAvailable: true,
            isActive: true,
            ratingAverage: 4.9,
            ratingCount: 128,
          },
          {
            _id: 'mock-2',
            code: 'LUT-RED-01',
            name: 'Gạo Lứt Huyết Rồng Điện Biên',
            slug: 'gao-lut-huyet-rong',
            category: 'Gạo Lứt Dinh Dưỡng' as any,
            description: 'Gạo lứt giảm cân, nhiều chất xơ, hỗ trợ tim mạch và người ăn kiêng thực dưỡng.',
            images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600'],
            characteristics: { stickiness: 3, aroma: 4, softness: 4, chalkiness: 2, grainLengthMm: 6.8, originRegion: 'Điện Biên', harvestSeason: 'Hè Thu 2026' },
            packagingOptions: [
              { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 160000, stockQuantity: 60, isAvailable: true },
              { sizeKg: 10, unitName: 'Túi 10kg', priceVnd: 310000, stockQuantity: 30, isAvailable: true },
            ],
            tieredDiscounts: [],
            isFeatured: true,
            isB2BAvailable: true,
            isActive: true,
            ratingAverage: 4.8,
            ratingCount: 85,
          },
          {
            _id: 'mock-3',
            code: 'ECO-ORGANIC-01',
            name: 'Gạo Hữu Cơ Eco Sạch Chuẩn USDA',
            slug: 'gao-huu-co-eco',
            category: 'Gạo Hữu Cơ Eco' as any,
            description: 'Không thuốc trừ sâu, không chất bảo quản, đạt chứng nhận hữu cơ quốc tế.',
            images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=600'],
            characteristics: { stickiness: 4, aroma: 4, softness: 5, chalkiness: 1, grainLengthMm: 7.2, originRegion: 'An Giang', harvestSeason: 'Đông Xuân 2026' },
            packagingOptions: [
              { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 220000, stockQuantity: 40, isAvailable: true },
              { sizeKg: 25, unitName: 'Bao 25kg', priceVnd: 1050000, stockQuantity: 15, isAvailable: true },
            ],
            tieredDiscounts: [],
            isFeatured: true,
            isB2BAvailable: true,
            isActive: true,
            ratingAverage: 5.0,
            ratingCount: 64,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rice-slate via-[#1E4D2B] to-rice-green text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-xl mx-4 sm:mx-8 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-rice-gold/20 text-rice-gold border border-rice-gold/40 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Gạo ST25 Đạt Giải Nhất Thế Giới</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Tổng Kho Gạo Sạch & Nông Sản Việt <span className="text-rice-gold">Chuẩn ISO 22000</span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
              Cung cấp Gạo ST25 chính gốc Sóc Trăng, Gạo lứt dinh dưỡng và Gạo giá sỉ đóng bao 25kg/50kg cho Nhà hàng, Bếp ăn công nghiệp. Tự động tính phí vận chuyển theo khối lượng (Kg).
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-rice-gold text-rice-slate font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:bg-rice-gold/90 transition-all hover:scale-105"
              >
                <span>Xem Danh Mục Gạo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/b2b-quote"
                className="flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <Building2 className="w-4 h-4 text-rice-gold" />
                <span>Đăng Ký Báo Giá Sỉ B2B</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div>
                <span className="block text-2xl font-black text-rice-gold">100%</span>
                <span className="text-xs text-gray-300">Gạo Chính Hãng</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-rice-gold">5.000+</span>
                <span className="text-xs text-gray-300">Tấn Đã Giao</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-rice-gold">24/7</span>
                <span className="text-xs text-gray-300">Giao Xe Tải Tận Nơi</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=1000"
                alt="Gạo ST25 Trắng Ngần Nông Sản Việt"
                className="rounded-2xl w-full h-80 sm:h-96 object-cover brightness-105 contrast-105"
              />
              <div className="absolute -bottom-4 -left-4 bg-rice-gold text-rice-slate p-4 rounded-2xl shadow-xl flex items-center space-x-3">
                <Scale className="w-8 h-8 font-black" />
                <div>
                  <span className="text-xs font-bold block uppercase">Vận Chuyển Khối Lượng</span>
                  <span className="text-sm font-black">Tính Phí Tự Động Theo Kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-rice-green/15 eco-card flex items-start space-x-4">
            <div className="w-12 h-12 bg-rice-lightgreen rounded-xl flex items-center justify-center text-rice-green flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rice-slate">Cam Kết Chất Lượng ISO</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Gạo tươi đóng gói tại nhà máy Sóc Trăng. Không nấm mốc, không chất tẩy trắng, không hương liệu nhân tạo.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rice-green/15 eco-card flex items-start space-x-4">
            <div className="w-12 h-12 bg-rice-gold/20 rounded-xl flex items-center justify-center text-rice-slate flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rice-slate">Chiết Khấu Sỉ Cho Nhà Hàng</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Chiết khấu lên đến 15% cho đơn hàng mua từ 500kg - 5 tấn. Hỗ trợ hợp đồng nguyên tắc & VAT.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rice-green/15 eco-card flex items-start space-x-4">
            <div className="w-12 h-12 bg-rice-lightgreen rounded-xl flex items-center justify-center text-rice-green flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rice-slate">Giao Hàng Trọng Lượng Tải</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Đội xe vận tải giao tận nơi. Miễn phí vận chuyển cho đơn hàng từ 100kg hoặc trên 2 triệu đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-rice-green uppercase tracking-wider block">Gạo Nông Sản Chọn Lọc</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-rice-slate tracking-tight flex items-center gap-2">
              <Wheat className="w-7 h-7 text-rice-gold" />
              <span>Sản Phẩm Gạo Nổi Bật Bán Chạy</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-bold text-rice-green hover:text-rice-slate transition-colors"
          >
            <span>Tất Cả Sản Phẩm</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* B2B Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rice-wood/80 border border-rice-gold/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="bg-rice-gold text-rice-slate font-extrabold text-xs px-3 py-1 rounded-md uppercase">
              Dành Cho Khách Hàng Doanh Nghiệp
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-rice-slate">
              Bạn Cần Nhập Gạo Giá Sỉ Cho Nhà Hàng, Quán Ăn Hoặc Bếp Ăn Công Nghiệp?
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Nông Sản Việt cung cấp giải pháp nguồn cung gạo ổn định quanh năm, cam kết đúng chủng loại, đóng bao 25kg/50kg tiêu chuẩn, miễn phí mẫu thử tận nơi.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/b2b-quote"
              className="flex items-center gap-2 bg-rice-green text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:bg-rice-green/90 transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-rice-gold" />
              <span>Gửi Yêu Cầu Báo Giá Sỉ</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
