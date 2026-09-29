import { Order, OrderStatus, OrderTimelineStep, CartItem, Address, PaymentMethodType, RazorpayPaymentDetails, AdminStats } from '../types';
import { storage } from './storage.service';
import { catalogService } from './catalog.service';

const ORDERS_STORAGE_KEY = '@volttech_orders_list';

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-88219',
    orderNumber: 'VT-ORD-88219',
    userId: 'user-default',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@volttech.io',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'cart-init-1',
        product: {
          id: 'prod-titanpulse-ultra',
          name: 'TitanPulse Ultra Titanium Smartwatch',
          brand: 'VoltWear',
          tagline: 'Aerospace-Grade Titanium GPS Smartwatch',
          description: 'Titanium Smartwatch',
          categoryId: 'cat-wearables',
          categoryName: 'Wearables',
          price: 18499,
          originalPrice: 22999,
          discountPercentage: 20,
          rating: 4.8,
          reviewCount: 1820,
          inStock: true,
          stockCount: 12,
          images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          ],
          specs: [],
        },
        quantity: 1,
        selectedVariants: { 'Band Type': 'Trail Loop Charcoal' },
        priceAtAddition: 18499,
      },
    ],
    shippingAddress: {
      id: 'addr-1',
      userId: 'user-default',
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 402, Cyber Heights Apartments',
      addressLine2: 'Outer Ring Road, Bellandur',
      landmark: 'Near Ecospace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      type: 'HOME',
      isDefault: true,
    },
    paymentMethod: 'upi_gpay',
    paymentDetails: {
      razorpayOrderId: 'order_VT88219A',
      razorpayPaymentId: 'pay_VT88219P',
      razorpaySignature: 'rzp_sig_verified_88219',
      method: 'upi_gpay',
      vpa: 'rahul@okhdfcbank',
      status: 'captured',
    },
    subtotal: 18499,
    discount: 500,
    couponCode: 'VOLT500',
    shippingFee: 0,
    tax: 2745,
    totalAmount: 17999,
    status: 'shipped',
    trackingNumber: 'BLUEDART-EXP-9921448',
    courierName: 'BlueDart Express Air',
    estimatedDeliveryDate: 'Tomorrow by 2:00 PM',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'confirmed',
        title: 'Order Placed & Verified',
        description: 'Payment authorized via Razorpay UPI (Google Pay)',
        date: 'Yesterday, 10:14 AM',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Packaged at VoltTech Hub',
        description: 'Quality tested & sealed with anti-tamper security tag',
        date: 'Yesterday, 4:30 PM',
        completed: true,
      },
      {
        status: 'shipped',
        title: 'Dispatched via Air Express',
        description: 'In transit to Bengaluru Central Delivery Hub',
        date: 'Today, 6:00 AM',
        completed: true,
        current: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Assigned to courier partner for final delivery',
        date: 'Expected Tomorrow',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivered to recipient with OTP verification',
        date: 'Pending',
        completed: false,
      },
    ],
  },
];

export interface IOrderService {
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(data: {
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
  }): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  getAdminStats(): Promise<AdminStats>;
}

class OrderService implements IOrderService {
  async getOrders(userId?: string): Promise<Order[]> {
    const list = await storage.getItem<Order[]>(ORDERS_STORAGE_KEY);
    if (!list || list.length === 0) {
      await storage.setItem(ORDERS_STORAGE_KEY, INITIAL_SAMPLE_ORDERS);
      return INITIAL_SAMPLE_ORDERS;
    }
    if (userId) {
      return list.filter((o) => o.userId === userId || o.userId === 'user-default');
    }
    return list;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const list = await this.getOrders();
    return list.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  async createOrder(data: {
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
  }): Promise<Order> {
    const orders = await this.getOrders();
    const orderNum = `VT-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const timeline: OrderTimelineStep[] = [
      {
        status: 'confirmed',
        title: 'Order Placed & Verified',
        description: `Payment authorized via Razorpay (${data.paymentMethod})`,
        date: 'Just now',
        completed: true,
        current: true,
      },
      {
        status: 'processing',
        title: 'Packing at Silicon Logistics Center',
        description: 'Hardware diagnostics and barcode verification',
        date: 'Expected in 4 hours',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Express Air Dispatch',
        description: 'BlueDart Express Air airway bill generated',
        date: 'Expected by tomorrow morning',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Delivery partner with OTP confirmation',
        date: 'Expected within 2-3 business days',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivered and signed by recipient',
        date: 'Pending',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items: data.items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails,
      subtotal: data.subtotal,
      discount: data.discount,
      couponCode: data.couponCode,
      shippingFee: data.shippingFee,
      tax: data.tax,
      totalAmount: data.totalAmount,
      status: 'confirmed',
      timeline,
      trackingNumber: `BLUEDART-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierName: 'BlueDart Express Air',
      estimatedDeliveryDate: 'In 2-3 business days',
      createdAt: now.toISOString(),
    };

    const updated = [newOrder, ...orders];
    await storage.setItem(ORDERS_STORAGE_KEY, updated);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) {
      throw new Error(`Order ${orderId} not found`);
    }

    const order = orders[idx];
    const orderStatuses: OrderStatus[] = [
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];

    const currentStatusIdx = orderStatuses.indexOf(newStatus);

    const updatedTimeline = order.timeline.map((step) => {
      const stepIdx = orderStatuses.indexOf(step.status);
      if (newStatus === 'cancelled') {
        return {
          ...step,
          completed: false,
          current: false,
        };
      }
      return {
        ...step,
        completed: stepIdx <= currentStatusIdx,
        current: stepIdx === currentStatusIdx,
      };
    });

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline,
    };

    orders[idx] = updatedOrder;
    await storage.setItem(ORDERS_STORAGE_KEY, orders);
    return updatedOrder;
  }

  async getAdminStats(): Promise<AdminStats> {
    const orders = await this.getOrders();
    const products = await catalogService.getProducts();

    const grossRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;
    const pendingShipments = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyRevenue = days.map((day, idx) => ({
      day,
      amount: Math.round((grossRevenue / 7) * (0.8 + idx * 0.1)),
    }));

    return {
      grossRevenue,
      totalOrders,
      activeProducts: products.length,
      totalCustomers: 1240,
      averageOrderValue,
      pendingShipments,
      recentOrders: orders.slice(0, 5),
      weeklyRevenue,
    };
  }
}

export const orderService = new OrderService();
