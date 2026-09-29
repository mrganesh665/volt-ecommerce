import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useOrder } from '../../context/OrderContext';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltBadge } from '../../components/common/VoltBadge';
import { CartItem } from '../../types';

export const OrderSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute, navigate } = useNavigation();
  const { getOrderById, orders } = useOrder();

  const orderId = currentRoute.params?.orderId;
  const order = (orderId && getOrderById(orderId)) || orders[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Animated Checkmark Stage */}
        <View style={styles.celebrationStage}>
          <View
            style={[
              styles.checkCircle,
              { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.tertiary },
            ]}
          >
            <Ionicons name="checkmark-circle" size={64} color={colors.tertiary} />
          </View>

          <Text style={[Typography.displayLg, { color: colors.textPrimary, marginTop: Spacing.md, textAlign: 'center' }]}>
            Payment Confirmed!
          </Text>

          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs, maxWidth: 320 },
            ]}
          >
            Your hardware order has been verified through Razorpay 256-bit gateway and assigned to
            our air express packing hub.
          </Text>

          {order && (
            <View style={[styles.orderNumberPill, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[Typography.labelMd, { color: colors.primary, fontWeight: '800' }]}>
                ORDER: {order.orderNumber}
              </Text>
            </View>
          )}
        </View>

        {order && (
          <>
            {/* Delivery Estimation Card */}
            <VoltCard variant="glass" style={styles.deliveryCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.airIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                  <MaterialIcons name="local-airport" size={24} color={colors.primary} />
                </View>
                <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                  <Text style={[Typography.labelSm, { color: colors.textTertiary, textTransform: 'uppercase' }]}>
                    Estimated Express Delivery
                  </Text>
                  <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                    {order.estimatedDeliveryDate}
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.tertiary, marginTop: 2 }]}>
                    Dispatched via {order.courierName} ({order.trackingNumber})
                  </Text>
                </View>
              </View>
            </VoltCard>

            {/* Order Items Preview */}
            <VoltCard variant="glass" style={styles.detailsCard}>
              <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
                Items in This Shipment
              </Text>

              {order.items.map((item: CartItem) => (
                <View key={item.id} style={styles.itemRow}>
                  <Image source={{ uri: item.product.images[0] }} style={styles.itemThumb} resizeMode="contain" />
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <Text numberOfLines={1} style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                      {item.product.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                      Qty: {item.quantity} • ₹{item.priceAtAddition.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <Text style={[Typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>
                    ₹{(item.priceAtAddition * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              <View style={styles.addressSummaryRow}>
                <Ionicons name="location-sharp" size={16} color={colors.primary} />
                <View style={{ marginLeft: 6, flex: 1 }}>
                  <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                    Shipping to {order.shippingAddress.fullName}
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city} {order.shippingAddress.pincode}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentMethodRow}>
                <Ionicons name="card" size={16} color={colors.tertiary} />
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: 6 }]}>
                  Paid via Razorpay ({order.paymentDetails.method}) • Ref: {order.paymentDetails.razorpayPaymentId}
                </Text>
              </View>
            </VoltCard>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <VoltButton
            title="Track Order in Real-Time"
            icon={<Ionicons name="navigate-outline" size={18} color={colors.onPrimaryContainer} />}
            onPress={() => navigate('order_detail', { orderId: order?.id })}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('home')}
            style={styles.continueShoppingBtn}
          >
            <Text style={[Typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 48,
    paddingBottom: 48,
  },
  celebrationStage: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderNumberPill: {
    marginTop: Spacing.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Roundness.full,
  },
  deliveryCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  airIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  itemThumb: {
    width: 44,
    height: 44,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  addressSummaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  actionsRow: {
    gap: Spacing.sm,
  },
  continueShoppingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
