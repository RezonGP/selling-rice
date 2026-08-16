import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, IProduct } from '../types';

interface CartContextType {
  items: ICartItem[];
  totalWeightKg: number;
  subtotalVnd: number;
  discountVnd: number;
  shippingFeeVnd: number;
  totalVnd: number;
  addToCart: (product: IProduct, sizeKg: number, quantity: number) => void;
  removeFromCart: (productId: string, sizeKg: number) => void;
  updateQuantity: (productId: string, sizeKg: number, delta: number) => void;
  clearCart: () => void;
  province: string;
  setProvince: (prov: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ICartItem[]>(() => {
    const saved = localStorage.getItem('rice_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [province, setProvince] = useState<string>('Hồ Chí Minh');

  useEffect(() => {
    localStorage.setItem('rice_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: IProduct, sizeKg: number, quantity: number) => {
    const packaging = product.packagingOptions.find((p) => p.sizeKg === sizeKg);
    if (!packaging) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id && item.selectedSizeKg === sizeKg
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const itemTotalWeightKg = sizeKg * newQty;
        const itemTotalPriceVnd = packaging.priceVnd * newQty;

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotalWeightKg,
          itemTotalPriceVnd,
        };
        return updated;
      } else {
        const itemTotalWeightKg = sizeKg * quantity;
        const itemTotalPriceVnd = packaging.priceVnd * quantity;
        return [
          ...prev,
          {
            product,
            selectedSizeKg: sizeKg,
            unitName: packaging.unitName,
            priceVnd: packaging.priceVnd,
            quantity,
            itemTotalWeightKg,
            itemTotalPriceVnd,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, sizeKg: number) => {
    setItems((prev) => prev.filter((item) => !(item.product._id === productId && item.selectedSizeKg === sizeKg)));
  };

  const updateQuantity = (productId: string, sizeKg: number, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.product._id === productId && item.selectedSizeKg === sizeKg) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotalWeightKg: sizeKg * newQty,
              itemTotalPriceVnd: item.priceVnd * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as ICartItem[];
    });
  };

  const clearCart = () => setItems([]);

  // Calculate Aggregates
  const totalWeightKg = items.reduce((acc, item) => acc + item.itemTotalWeightKg, 0);
  const subtotalVnd = items.reduce((acc, item) => acc + item.itemTotalPriceVnd, 0);

  // Volume Discount Strategy
  let discountVnd = 0;
  if (totalWeightKg >= 500) {
    discountVnd = Math.round(subtotalVnd * 0.15);
  } else if (totalWeightKg >= 100) {
    discountVnd = Math.round(subtotalVnd * 0.1);
  } else if (totalWeightKg >= 50) {
    discountVnd = Math.round(subtotalVnd * 0.05);
  }

  // Weight-based shipping fee preview
  let shippingFeeVnd = 0;
  if (subtotalVnd >= 2000000 || totalWeightKg >= 100) {
    shippingFeeVnd = 0;
  } else {
    const isLocal = province.toLowerCase().includes('hồ chí minh') || province.toLowerCase().includes('hà nội');
    const baseFee = isLocal ? 25000 : 40000;
    if (totalWeightKg <= 5) shippingFeeVnd = baseFee;
    else if (totalWeightKg <= 20) shippingFeeVnd = baseFee + (totalWeightKg - 5) * 3500;
    else if (totalWeightKg <= 50) shippingFeeVnd = baseFee + 15 * 3500 + (totalWeightKg - 20) * 2500;
    else shippingFeeVnd = totalWeightKg * 2000;
    shippingFeeVnd = Math.round(shippingFeeVnd / 1000) * 1000;
  }

  const totalVnd = subtotalVnd - discountVnd + shippingFeeVnd;

  return (
    <CartContext.Provider
      value={{
        items,
        totalWeightKg,
        subtotalVnd,
        discountVnd,
        shippingFeeVnd,
        totalVnd,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        province,
        setProvince,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
