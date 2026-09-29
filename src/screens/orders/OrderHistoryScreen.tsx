import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useOrder } from '../../context/OrderContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';
import { OrderStatus } from '../../types';

export const OrderHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { orders } = useOrder();

  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return o.status === 'confirmed' || o.status === 'processing' || o.status === 'shipped' || o.status === 'out_for_delivery';
    }
    if (filter === 'delivered') {
      return o.status === 'delivered';
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <VoltBadge label="DELIVERED" variant="emerald" size="sm" />;
      case 'shipped':
        return <VoltBadge label="IN TRANSIT" variant="cyan" size="sm" />;
      case 'out_for_delivery':
        return <VoltBadge label="OUT FOR DELIVERY" variant="cyan" size="sm" />;
      case 'processing':
        return <VoltBadge label="PACKING" variant="violet" size="sm" />;
      case 'cancelled':
        return <VoltBadge label="CANCELLED" variant="error" size="sm" />;
      case 'confirmed':
      default:
        return <VoltBadge label="CONFIRMED" variant="cyan" size="sm" />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="My Hardware Orders" showLogo={false} showDelivery={false} />

      {/* Status Filter Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.divider }]}>
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'active', label: 'Active Shipments' },
          { key: 'delivered', label: 'Delivered' },
        ].map((tab) => {
          const isSel = filter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => setFilter(tab.key as any)}
              style={[
                styles.tabBtn,
                { borderBottomColor: isSel ? colors.primary : 'transparent' },
              ]}
            >
              <Text
                style={[
                  Typography.labelMd,
                  {
                    color: isSel ? colors.primary : colors.textTertiary,
                    fontWeight: isSel ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <VoltCard
                key={order.id}
                variant="glass"
                style={styles.orderCard}
                onPress={() => navigate('order_detail', { orderId: order.id })}
              >
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                      {order.orderNumber}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  {getStatusBadge(order.status)}
                </View>

                {/* Items Thumbnails */}
                <View style={styles.thumbnailsRow}>
                  {order.items.slice(0, 3).map((item) => (
                    <View key={item.id} style={[styles.thumbBox, { backgroundColor: colors.surfaceContainerLow }]}>
                      <Image source={{ uri: item.product.images[0] }} style={styles.thumbImage} resizeMode="contain" />
                    </View>
                  ))}
                  {order.items.length > 3 && (
                    <View style={[styles.thumbBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                      <Text style={[Typography.labelSm, { color: colors.textPrimary }]}>
                        +{order.items.length - 3}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <Text numberOfLines={1} style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '600' }]}>
                      {order.items[0]?.product.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      {order.items.length} {order.items.length === 1 ? 'device' : 'devices'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                <View style={styles.orderCardFooter}>
                  <View>
                    <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>TOTAL</Text>
                    <Text style={[Typography.priceCard, { color: colors.primary }]}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[Typography.labelMd, { color: colors.primary, marginRight: 4 }]}>
                      View Waypoint Tracking
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </View>
                </View>
              </VoltCard>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.textTertiary} />
            <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              No Orders Found
            </Text>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs }]}>
              You have no {filter !== 'all' ? filter : ''} orders yet.
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  ordersList: {
    gap: Spacing.md,
  },
  orderCard: {
    padding: Spacing.md,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  thumbBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  thumbImage: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.sm,
  },
  orderCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
});
