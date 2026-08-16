import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Award, Check } from 'lucide-react';
import { IProduct } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSizeKg, setSelectedSizeKg] = useState<number>(
    product.packagingOptions[0]?.sizeKg || 5
  );
  const [addedSuccess, setAddedSuccess] = useState(false);

  const selectedPackaging =
    product.packagingOptions.find((p) => p.sizeKg === selectedSizeKg) || product.packagingOptions[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedSizeKg, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const defaultImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-rice-green/15 eco-card flex flex-col justify-between">
      <div>
        {/* Image & Category Badge */}
        <div className="relative h-52 overflow-hidden bg-rice-wood/40">
          <img
            src={defaultImage}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-rice-green text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
            {product.category}
          </div>
          {product.isB2BAvailable && (
            <div className="absolute top-3 right-3 bg-rice-gold text-rice-slate font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Giá Sỉ B2B
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-5">
          <div className="flex items-center space-x-1 mb-1.5 text-rice-gold">
            <Star className="w-3.5 h-3.5 fill-rice-gold" />
            <span className="text-xs font-bold text-rice-slate">{product.ratingAverage.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">({product.ratingCount || 12} đánh giá)</span>
          </div>

          <Link to={`/products/${product.slug}`}>
            <h3 className="text-base font-bold text-rice-slate hover:text-rice-green transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rice Characteristic Badges */}
          <div className="flex items-center space-x-3 my-3 text-xs bg-rice-lightgreen/50 p-2 rounded-xl">
            <span className="font-semibold text-rice-green">Dẻo: {'★'.repeat(product.characteristics.stickiness)}</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-rice-green">Thơm: {'★'.repeat(product.characteristics.aroma)}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-medium">{product.characteristics.originRegion}</span>
          </div>

          {/* Packaging Size Selector */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Chọn Quy Cách Đóng Gói:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {product.packagingOptions.map((opt) => (
                <button
                  key={opt.sizeKg}
                  onClick={() => setSelectedSizeKg(opt.sizeKg)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    selectedSizeKg === opt.sizeKg
                      ? 'bg-rice-green text-white border-rice-green shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-rice-green/50'
                  }`}
                >
                  {opt.sizeKg} Kg
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-5 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 block font-medium">Giá {selectedPackaging.unitName}</span>
          <span className="text-lg font-extrabold text-rice-slate">
            {selectedPackaging.priceVnd.toLocaleString('vi-VN')} <span className="text-xs text-gray-500 font-normal">đ</span>
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
            addedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-rice-gold text-rice-slate hover:bg-rice-gold/90'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Đã Thêm</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm Giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
