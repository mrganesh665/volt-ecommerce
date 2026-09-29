import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useOrder } from '../../context/OrderContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';
import { OrderStatus } from '../../types';

export const AdminOrdersScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { orders, updateOrderStatus } = useOrder();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all') {
      return o.status === statusFilter;
    }
    return true;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'confirmed':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'out_for_delivery';
      case 'out_for_delivery':
        return 'delivered';
      default:
        return null;
    }
  };

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const next = getNextStatus(currentStatus);
    if (!next) return;

    setUpdatingId(orderId);
    await updateOrderStatus(orderId, next);
    setUpdatingId(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={`Store Orders Queue (${orders.length})`}
        showLogo={false}
        showDelivery={false}
      />

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filterScroll, { backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.divider }]}
      >
        {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((st) => {
          const isSelected = statusFilter === st;
          return (
            <TouchableOpacity
              key={st}
              activeOpacity={0.7}
              onPress={() => setStatusFilter(st)}
              style={[
                styles.filterTab,
                {
                  borderBottomColor: isSelected ? colors.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  Typography.labelSm,
                  {
                    color: isSelected ? colors.primary : colors.textTertiary,
                    fontWeight: isSelected ? '700' : '500',
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {st.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          <View style={styles.list}>
            {filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const isUpdating = updatingId === order.id;

              return (
                <VoltCard key={order.id} variant="glass" style={styles.orderCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                        {order.orderNumber}
                      </Text>
                      <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                        Customer: {order.customerName} ({order.customerPhone})
                      </Text>
                    </View>

                    <VoltBadge
                      label={order.status.replace(/_/g, ' ').toUpperCase()}
                      variant={
                        order.status === 'delivered'
                          ? 'emerald'
                          : order.status === 'cancelled'
                          ? 'error'
                          : 'cyan'
                      }
                      size="sm"
                    />
                  </View>

                  <View style={[styles.detailsBox, { backgroundColor: colors.surfaceContainerLow }]}>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      Shipping: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Razorpay ID:{' '}
                      {order.paymentDetails.razorpayPaymentId}
                    </Text>
                    <Text style={[Typography.labelMd, { color: colors.primary, marginTop: 4 }]}>
                      Total: ₹{order.totalAmount.toLocaleString('en-IN')} (Paid)
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => navigate('order_detail', { orderId: order.id })}
                    >
                      <Text style={[Typography.labelMd, { color: colors.textSecondary }]}>
                        View Details
                      </Text>
                    </TouchableOpacity>

                    {nextStatus ? (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleAdvanceStatus(order.id, order.status)}
                        disabled={isUpdating}
                        style={[styles.advanceBtn, { backgroundColor: colors.primaryContainer }]}
                      >
                        <Ionicons name="arrow-forward" size={14} color={colors.onPrimaryContainer} />
                        <Text style={[Typography.labelSm, { color: colors.onPrimaryContainer, fontWeight: '700', marginLeft: 4 }]}>
                          Advance to {nextStatus.replace(/_/g, ' ').toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="checkmark-done" size={16} color={colors.tertiary} />
                        <Text style={[Typography.labelSm, { color: colors.tertiary, marginLeft: 4 }]}>
                          Order Completed
                        </Text>
                      </View>
                    )}
                  </View>
                </VoltCard>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.textTertiary} />
            <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              No Orders in This Status
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  list: {
    gap: Spacing.md,
  },
  orderCard: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailsBox: {
    padding: Spacing.sm,
    borderRadius: Roundness.sm,
    marginVertical: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Roundness.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
});
