import { PaymentMethodType, RazorpayPaymentDetails } from '../types';
import { storage } from './storage.service';

const RAZORPAY_CONFIG_KEY = '@volttech_razorpay_config';

export interface RazorpayGatewayConfig {
  keyId: string;
  merchantName: string;
  isTestMode: boolean;
  themeColor: string;
}

export const DEFAULT_RAZORPAY_CONFIG: RazorpayGatewayConfig = {
  keyId: 'rzp_test_VoltTechCommercial9982',
  merchantName: 'VoltTech Electronics India Pvt Ltd',
  isTestMode: true,
  themeColor: '#4cd7f6',
};

export interface IPaymentService {
  getConfig(): Promise<RazorpayGatewayConfig>;
  updateConfig(updates: Partial<RazorpayGatewayConfig>): Promise<RazorpayGatewayConfig>;
  createRazorpayOrder(amount: number, currency?: string): Promise<{ orderId: string; amount: number; currency: string }>;
  processPayment(params: {
    amount: number;
    method: PaymentMethodType;
    vpa?: string;
    cardDetails?: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    };
    bankName?: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<{ success: boolean; details?: RazorpayPaymentDetails; error?: string }>;
}

class RazorpayPaymentService implements IPaymentService {
  async getConfig(): Promise<RazorpayGatewayConfig> {
    const config = await storage.getItem<RazorpayGatewayConfig>(RAZORPAY_CONFIG_KEY);
    return config || DEFAULT_RAZORPAY_CONFIG;
  }

  async updateConfig(updates: Partial<RazorpayGatewayConfig>): Promise<RazorpayGatewayConfig> {
    const current = await this.getConfig();
    const updated = { ...current, ...updates };
    await storage.setItem(RAZORPAY_CONFIG_KEY, updated);
    return updated;
  }

  async createRazorpayOrder(amount: number, currency: string = 'INR'): Promise<{ orderId: string; amount: number; currency: string }> {
    // Generates a standard Razorpay Order Id format
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const orderId = `order_${randomHex}`;
    return {
      orderId,
      amount: Math.round(amount * 100), // amount in paise for Razorpay
      currency,
    };
  }

  async processPayment(params: {
    amount: number;
    method: PaymentMethodType;
    vpa?: string;
    cardDetails?: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    };
    bankName?: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<{ success: boolean; details?: RazorpayPaymentDetails; error?: string }> {
    // Simulate real gateway network handshake (300-800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validation checks per method
    if (params.method === 'upi_custom' && (!params.vpa || !params.vpa.includes('@'))) {
      return { success: false, error: 'Please provide a valid UPI ID (e.g. yourname@okhdfcbank)' };
    }

    if (params.method === 'card') {
      const cleanNum = params.cardDetails?.number?.replace(/\s/g, '') || '';
      if (cleanNum.length < 15) {
        return { success: false, error: 'Invalid card number. Please check the 16 digits.' };
      }
      if (!params.cardDetails?.expiry || !params.cardDetails.expiry.includes('/')) {
        return { success: false, error: 'Invalid card expiration (MM/YY).' };
      }
      if (!params.cardDetails?.cvv || params.cardDetails.cvv.length < 3) {
        return { success: false, error: 'Invalid CVV code.' };
      }
    }

    const { orderId } = await this.createRazorpayOrder(params.amount);
    const paymentId = `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    const signature = `rzp_sig_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`;

    let cardLast4: string | undefined;
    if (params.method === 'card' && params.cardDetails?.number) {
      const clean = params.cardDetails.number.replace(/\s/g, '');
      cardLast4 = clean.slice(-4);
    }

    const paymentDetails: RazorpayPaymentDetails = {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      method: params.method,
      vpa: params.vpa || (params.method.startsWith('upi_') ? 'user@okhdfcbank' : undefined),
      cardLast4,
      bankName: params.bankName || (params.method === 'netbanking' ? 'HDFC Bank' : undefined),
      status: 'captured',
    };

    return {
      success: true,
      details: paymentDetails,
    };
  }
}

export const paymentService = new RazorpayPaymentService();
