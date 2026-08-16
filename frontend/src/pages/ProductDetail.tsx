import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Truck, Scale, ArrowLeft, Check, Award } from 'lucide-react';
import { IProduct } from '../types';
import { apiClient } from '../api/client';
import { RiceMatrix } from '../components/RiceMatrix';
import { useCart } from '../context/CartContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedSizeKg, setSelectedSizeKg] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    apiClient
      .get(`/products/slug/${slug}`)
      .then((res) => {
        setProduct(res.data.data);
        if (res.data.data.packagingOptions.length > 0) {
          setSelectedSizeKg(res.data.data.packagingOptions[0].sizeKg);
        }
      })
      .catch(() => {
        // Fallback mock
        const mock: IProduct = {
          _id: 'mock-1',
          code: 'ST25-PREMIUM',
          name: 'Gạo ST25 Lúa Tôm Thơm Thượng Hạng',
          slug: 'gao-st25-lua-tom',
          category: 'Gạo Đặc Sản ST' as any,
          description:
            'Gạo ST25 chính hiệu Sóc Trăng hạt dài, trắng trong, cơm dẻo nhiều, thơm mùi lá dứa tự nhiên. Được chứng nhận giải nhất Gạo Thơm Ngon Nhất Thế Giới.',
          images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'],
          characteristics: {
            stickiness: 5,
            aroma: 5,
            softness: 5,
            chalkiness: 1,
            grainLengthMm: 7.5,
            originRegion: 'Sóc Trăng',
            harvestSeason: 'Vụ Đông Xuân 2026',
          },
          packagingOptions: [
            { sizeKg: 5, unitName: 'Túi 5kg', priceVnd: 195000, stockQuantity: 50, isAvailable: true },
            { sizeKg: 10, unitName: 'Túi 10kg', priceVnd: 380000, stockQuantity: 40, isAvailable: true },
            { sizeKg: 25, unitName: 'Bao 25kg', priceVnd: 920000, stockQuantity: 20, isAvailable: true },
            { sizeKg: 50, unitName: 'Bao 50kg Sỉ', priceVnd: 1800000, stockQuantity: 10, isAvailable: true },
          ],
          tieredDiscounts: [
            { minQuantityKg: 50, discountPercentage: 5 },
            { minQuantityKg: 100, discountPercentage: 10 },
            { minQuantityKg: 500, discountPercentage: 15 },
          ],
          isFeatured: true,
          isB2BAvailable: true,
          isActive: true,
          ratingAverage: 4.9,
          ratingCount: 128,
        };
        setProduct(mock);
      });
  }, [slug]);

  if (!product) {
    return <div className="py-20 text-center font-bold text-gray-400">Đang tải thông tin chi tiết gạo...</div>;
  }

  const selectedPackaging =
    product.packagingOptions.find((p) => p.sizeKg === selectedSizeKg) || product.packagingOptions[0];

  const totalWeightForSelection = selectedSizeKg * quantity;
  const totalPriceForSelection = selectedPackaging.priceVnd * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedSizeKg, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-rice-green hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Danh Mục Gạo</span>
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-rice-green/20 overflow-hidden shadow-md">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
          <div className="flex items-center justify-around bg-rice-lightgreen/50 p-4 rounded-2xl border border-rice-green/20 text-xs font-semibold text-rice-slate">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rice-green" />
              <span>Chuẩn ISO 22000</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-rice-gold" />
              <span>Gạo Chính Hãng 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rice-green" />
              <span>Giao Xe Tải Nhanh</span>
            </div>
          </div>
        </div>

        {/* Product Actions & Pricing */}
        <div className="space-y-6">
          <div>
            <div className="inline-block bg-rice-green text-white font-bold text-xs px-3 py-1 rounded-lg mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl font-extrabold text-rice-slate tracking-tight leading-snug">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-2 text-xs font-bold text-rice-slate">
              <Star className="w-4 h-4 fill-rice-gold text-rice-gold" />
              <span>{product.ratingAverage}</span>
              <span className="text-gray-400">({product.ratingCount} đánh giá từ nhà hàng & hộ gia đình)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{product.description}</p>

          {/* Packaging Size Selector */}
          <div className="bg-white p-5 rounded-2xl border border-rice-green/20 space-y-3">
            <label className="text-xs font-bold text-rice-slate block uppercase tracking-wider">
              1. Chọn Quy Cách Đóng Gói:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.packagingOptions.map((opt) => (
                <button
                  key={opt.sizeKg}
                  onClick={() => setSelectedSizeKg(opt.sizeKg)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSizeKg === opt.sizeKg
                      ? 'bg-rice-green text-white border-rice-green shadow-md'
                      : 'bg-rice-cream text-rice-slate border-gray-200 hover:border-rice-green/40'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.unitName}</span>
                  <span className="block text-[11px] opacity-80 mt-0.5">
                    {opt.priceVnd.toLocaleString('vi-VN')} đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Weight Calculator */}
          <div className="bg-rice-lightgreen/40 p-5 rounded-2xl border border-rice-green/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Đơn giá cho quy cách {selectedPackaging.unitName}:</span>
                <span className="text-2xl font-black text-rice-slate">
                  {selectedPackaging.priceVnd.toLocaleString('vi-VN')} <span className="text-xs font-normal">VNĐ</span>
                </span>
              </div>

              {/* Quantity incrementer */}
              <div className="flex items-center space-x-3 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="font-bold text-gray-600 hover:text-rice-green px-1"
                >
                  -
                </button>
                <span className="text-sm font-extrabold text-rice-slate px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="font-bold text-gray-600 hover:text-rice-green px-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Weight Bar */}
            <div className="flex items-center justify-between text-xs font-extrabold text-rice-green border-t border-rice-green/20 pt-3">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> Tổng Trọng Lượng Mua:
              </span>
              <span className="bg-rice-green text-white px-2.5 py-1 rounded-md">{totalWeightForSelection} Kg</span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rice-gold text-rice-slate hover:bg-rice-gold/90 hover:scale-[1.01]'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Đã Thêm {totalWeightForSelection} Kg Vào Giỏ Hàng!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Thêm Vào Giỏ Hàng ({totalPriceForSelection.toLocaleString('vi-VN')} đ)</span>
                </>
              )}
            </button>
          </div>

          {/* Tiered Discount Table */}
          {product.tieredDiscounts && product.tieredDiscounts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-2">
              <span className="font-extrabold text-amber-900 uppercase tracking-wider block">
                Bảng Chiết Khấu Mua Sỉ Tự Động (Volume Discount):
              </span>
              <ul className="space-y-1 text-gray-700">
                {product.tieredDiscounts.map((td) => (
                  <li key={td.minQuantityKg} className="flex justify-between font-semibold">
                    <span>Mua từ {td.minQuantityKg} Kg trở lên:</span>
                    <span className="text-emerald-700 font-extrabold">Giảm ngay {td.discountPercentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Rice Characteristics Radar Matrix */}
      <RiceMatrix characteristics={product.characteristics} />
    </div>
  );
};
