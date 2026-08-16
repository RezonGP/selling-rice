import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { IProduct, RiceCategory } from '../types';
import { apiClient } from '../api/client';
import { Search, Filter, Wheat } from 'lucide-react';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = '/products';
    const params: string[] = [];
    if (selectedCategory !== 'ALL') params.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `?${params.join('&')}`;

    apiClient
      .get(url)
      .then((res) => setProducts(res.data.data))
      .catch(() => {
        // Mock items if API fallback
        setProducts([
          {
            _id: 'mock-1',
            code: 'ST25-PREMIUM',
            name: 'Gạo ST25 Lúa Tôm Thơm Thượng Hạng',
            slug: 'gao-st25-lua-tom',
            category: RiceCategory.SPECIALTY,
            description: 'Gạo ST25 chính hiệu Sóc Trăng trồng trên vùng đất lúa tôm dẻo thơm hạt dài trắng ngần.',
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600'],
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
            category: RiceCategory.BROWN,
            description: 'Gạo lứt giảm cân, nhiều chất xơ, hỗ trợ tim mạch và người ăn kiêng thực dưỡng.',
            images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=600'],
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
            category: RiceCategory.ORGANIC,
            description: 'Không thuốc trừ sâu, không chất bảo quản, đạt chứng nhận hữu cơ quốc tế.',
            images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600'],
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
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-rice-slate tracking-tight flex items-center gap-3">
          <Wheat className="w-8 h-8 text-rice-gold" />
          <span>Danh Mục Gạo & Nông Sản Sạch</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Chọn loại gạo thích hợp với quy cách túi 5kg, 10kg hoặc bao 25kg, 50kg cho gia đình và doanh nghiệp.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-rice-green/15 eco-glass flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm tên gạo, xuất xứ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-rice-cream border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-rice-slate focus:outline-none focus:ring-2 focus:ring-rice-green"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-rice-green text-white shadow-sm'
                : 'bg-rice-cream text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất Cả Loại Gạo
          </button>
          {Object.values(RiceCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rice-green text-white shadow-sm'
                  : 'bg-rice-cream text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-gray-400">Đang tải danh mục gạo...</div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
          <p className="text-base font-bold text-rice-slate">Không tìm thấy sản phẩm gạo phù hợp!</p>
          <p className="text-xs text-gray-400 mt-1">Vui lòng thử lại với từ khóa tìm kiếm khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
