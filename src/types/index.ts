export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  isVip?: boolean;
  createdAt: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginDTO {
  emailOrPhone: string;
  password: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: { label: string; value: string; priceDelta?: number }[];
}

export interface ProductSpec {
  group: string;
  items: { label: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  stockCount: number;
  inStock: boolean;
  isFlashDeal?: boolean;
  isFeatured?: boolean;
  dealEndsInHours?: number;
  soldPercentage?: number;
  specs: ProductSpec[];
  variants?: ProductVariant[];
  badges?: string[];
  warranty?: string;
  returnPolicy?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // MaterialIcons or Ionicons name
  itemCount: number;
  bannerImage?: string;
  subcategories: string[];
}

export interface CartItem {
  id: string; // unique item entry id
  product: Product;
  quantity: number;
  selectedVariants?: { [variantName: string]: string };
  priceAtAddition: number;
}

export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
}

export type PaymentMethodType =
  | 'upi_gpay'
  | 'upi_phonepe'
  | 'upi_paytm'
  | 'upi_custom'
  | 'card'
  | 'netbanking'
  | 'paylater'
  | 'cod';

export interface RazorpayPaymentDetails {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  method: PaymentMethodType;
  vpa?: string;
  cardLast4?: string;
  bankName?: string;
  status: 'captured' | 'failed' | 'pending';
}

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethodType;
  paymentDetails: RazorpayPaymentDetails;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'deal' | 'system' | 'security';
  timestamp: string;
  read: boolean;
  orderId?: string;
  actionUrl?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export interface AdminStats {
  grossRevenue: number;
  totalOrders: number;
  activeProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingShipments: number;
  recentOrders: Order[];
  weeklyRevenue: { day: string; amount: number }[];
}

export interface SupportFaq {
  id: string;
  category: 'Orders' | 'Payments' | 'Delivery' | 'Warranty' | 'Returns';
  question: string;
  answer: string;
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}
