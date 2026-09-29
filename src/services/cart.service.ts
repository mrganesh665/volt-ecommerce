import { CartItem, Coupon } from '../types';
import { INITIAL_COUPONS } from './mockData';
import { storage } from './storage.service';

const COUPONS_STORAGE_KEY = '@volttech_coupons';

export interface CartCalculationResult {
  itemsCount: number;
  subtotal: number;
  originalSubtotal: number;
  totalSavings: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  shippingFee: number;
  tax: number;
  totalAmount: number;
}

export interface ICartService {
  getCoupons(): Promise<Coupon[]>;
  validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; message: string }>;
  calculate(items: CartItem[], coupon?: Coupon | null): CartCalculationResult;
}

class CartService implements ICartService {
  async getCoupons(): Promise<Coupon[]> {
    const stored = await storage.getItem<Coupon[]>(COUPONS_STORAGE_KEY);
    if (!stored || stored.length === 0) {
      await storage.setItem(COUPONS_STORAGE_KEY, INITIAL_COUPONS);
      return INITIAL_COUPONS;
    }
    return stored;
  }

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; message: string }> {
    const coupons = await this.getCoupons();
    const upper = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === upper);

    if (!found) {
      return { valid: false, message: 'Invalid promo coupon code.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        valid: false,
        message: `Coupon requires minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')}`,
      };
    }

    return { valid: true, coupon: found, message: 'Coupon applied successfully!' };
  }

  calculate(items: CartItem[], coupon?: Coupon | null): CartCalculationResult {
    let subtotal = 0;
    let originalSubtotal = 0;
    let itemsCount = 0;

    for (const item of items) {
      const price = item.priceAtAddition || item.product.price;
      const original = item.product.originalPrice || price;
      subtotal += price * item.quantity;
      originalSubtotal += original * item.quantity;
      itemsCount += item.quantity;
    }

    let couponDiscount = 0;
    if (coupon && subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'flat') {
        couponDiscount = coupon.discountValue;
      } else if (coupon.discountType === 'percentage') {
        const calculated = (subtotal * coupon.discountValue) / 100;
        couponDiscount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
      }
    }

    // Free express air shipping for orders above 999
    const shippingFee = subtotal === 0 || subtotal >= 999 ? 0 : 99;

    // Prices are GST inclusive in Indian e-commerce, but we calculate the tax component for transparency
    const discountedTotal = Math.max(0, subtotal - couponDiscount);
    const tax = Math.round((discountedTotal * 18) / 118);
    const totalAmount = discountedTotal + shippingFee;
    const totalSavings = Math.max(0, originalSubtotal - subtotal + couponDiscount);

    return {
      itemsCount,
      subtotal,
      originalSubtotal,
      totalSavings,
      couponDiscount,
      appliedCoupon: coupon || null,
      shippingFee,
      tax,
      totalAmount,
    };
  }
}

export const cartService = new CartService();
