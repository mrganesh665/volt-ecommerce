import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { cartService, CartCalculationResult } from '../services/cart.service';
import { storage } from '../services/storage.service';

const CART_STORAGE_KEY = '@volttech_cart_items';
const COUPON_STORAGE_KEY = '@volttech_applied_coupon';

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  totals: CartCalculationResult;
  addToCart: (product: Product, quantity?: number, selectedVariants?: { [variantName: string]: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  appliedCoupon: null,
  totals: cartService.calculate([]),
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyCoupon: async () => ({ success: false, message: '' }),
  removeCoupon: () => {},
  isInCart: () => false,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    Promise.all([
      storage.getItem<CartItem[]>(CART_STORAGE_KEY),
      storage.getItem<Coupon>(COUPON_STORAGE_KEY),
    ]).then(([savedItems, savedCoupon]) => {
      if (savedItems) setItems(savedItems);
      if (savedCoupon) setAppliedCoupon(savedCoupon);
    });
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    storage.setItem(CART_STORAGE_KEY, newItems);
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariants?: { [variantName: string]: string }
  ) => {
    const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : 'default';
    const itemId = `${product.id}_${variantKey}`;

    const existingIdx = items.findIndex((i) => i.id === itemId);
    if (existingIdx !== -1) {
      const updated = [...items];
      updated[existingIdx].quantity += quantity;
      saveCart(updated);
    } else {
      let finalPrice = product.price;
      if (selectedVariants && product.variants) {
        for (const [varName, val] of Object.entries(selectedVariants)) {
          const v = product.variants.find((v) => v.name === varName);
          const opt = v?.options.find((o) => o.value === val);
          if (opt?.priceDelta) finalPrice += opt.priceDelta;
        }
      }

      const newItem: CartItem = {
        id: itemId,
        product,
        quantity,
        selectedVariants,
        priceAtAddition: finalPrice,
      };
      saveCart([...items, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const updated = items.filter((i) => i.id !== itemId);
    saveCart(updated);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updated = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
    storage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = async (code: string) => {
    const totals = cartService.calculate(items);
    const result = await cartService.validateCoupon(code, totals.subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      await storage.setItem(COUPON_STORAGE_KEY, result.coupon);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    storage.removeItem(COUPON_STORAGE_KEY);
  };

  const isInCart = (productId: string) => {
    return items.some((i) => i.product.id === productId);
  };

  const totals = cartService.calculate(items, appliedCoupon);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        totals,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
