import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, CartItem, Address, PaymentMethodType, RazorpayPaymentDetails } from '../types';
import { orderService } from '../services/order.service';
import { notificationService } from '../services/notification.service';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  placeOrder: (data: {
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
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: true,
  refreshOrders: async () => {},
  getOrderById: () => undefined,
  placeOrder: async () => ({} as Order),
  updateOrderStatus: async () => ({} as Order),
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    const list = await orderService.getOrders();
    setOrders(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id || o.orderNumber === id);
  };

  const placeOrder = async (data: Parameters<typeof orderService.createOrder>[0]) => {
    const newOrder = await orderService.createOrder(data);
    await refreshOrders();

    // Trigger notification
    await notificationService.addNotification({
      title: `Order Confirmed: ${newOrder.orderNumber}`,
      message: `Your hardware order of ₹${newOrder.totalAmount.toLocaleString('en-IN')} has been verified via Razorpay and sent to packing.`,
      type: 'order',
      orderId: newOrder.id,
    });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, status);
    await refreshOrders();

    await notificationService.addNotification({
      title: `Order Status Updated: ${updated.orderNumber}`,
      message: `Your order status is now: ${status.replace(/_/g, ' ').toUpperCase()}.`,
      type: 'order',
      orderId: updated.id,
    });

    return updated;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        refreshOrders,
        getOrderById,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
