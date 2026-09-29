import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useOrder } from '../../context/OrderContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltButton } from '../../components/common/VoltButton';
import { OrderTimelineStep, CartItem } from '../../types';

export const OrderDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute, goBack, navigate } = useNavigation();
  const { getOrderById, updateOrderStatus, orders } = useOrder();

  const orderId = currentRoute.params?.orderId;
  const order = (orderId && getOrderById(orderId)) || orders[0];

  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);

  if (!order) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
        <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
          Order Not Found
        </Text>
        <TouchableOpacity
          onPress={() => goBack()}
          style={[styles.backBtn, { backgroundColor: colors.primaryContainer }]}
        >
          <Text style={[Typography.labelLg, { color: colors.onPrimaryContainer }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? Instant refund will be credited back via Razorpay.',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Confirm Cancel',
          style: 'destructive',
          onPress: async () => {
            await updateOrderStatus(order.id, 'cancelled');
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = () => {
    setInvoiceDownloaded(true);
    setTimeout(() => setInvoiceDownloaded(false), 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title={`Order ${order.orderNumber}`} showLogo={false} showDelivery={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <VoltCard variant="elevated" style={styles.statusHeaderCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>STATUS</Text>
              <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '800', textTransform: 'capitalize' }]}>
                {order.status.replace(/_/g, ' ')}
              </Text>
            </View>

            <VoltBadge
              label={order.status.toUpperCase()}
              variant={
                order.status === 'delivered'
                  ? 'emerald'
                  : order.status === 'cancelled'
                  ? 'error'
                  : 'cyan'
              }
              size="md"
            />
          </View>

          <View style={[styles.courierInfoRow, { backgroundColor: colors.surfaceContainerLow }]}>
            <MaterialIcons name="local-airport" size={20} color={colors.primary} />
            <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
              <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                {order.courierName}
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                Waybill AWB: {order.trackingNumber}
              </Text>
            </View>
            <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '700' }]}>
              EXPRESS AIR
            </Text>
          </View>
        </VoltCard>

        {/* Real-Time Waypoint Tracking Timeline */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.md }]}>
            Waypoint Tracking Timeline
          </Text>

          <View style={styles.timelineContainer}>
            {order.timeline.map((step: OrderTimelineStep, idx: number) => {
              const isLast = idx === order.timeline.length - 1;

              return (
                <View key={idx} style={styles.timelineRow}>
                  {/* Left Column: Icon and Vertical Line */}
                  <View style={styles.timelineIndicatorCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: step.completed
                            ? colors.tertiary
                            : step.current
                            ? colors.primaryContainer
                            : colors.surfaceContainerHigh,
                          borderColor: step.current ? colors.primary : 'transparent',
                          borderWidth: step.current ? 2 : 0,
                        },
                      ]}
                    >
                      {step.completed ? (
                        <Ionicons name="checkmark" size={12} color={colors.onTertiary} />
                      ) : step.current ? (
                        <Ionicons name="flash" size={10} color={colors.onPrimaryContainer} />
                      ) : (
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textTertiary }} />
                      )}
                    </View>

                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          {
                            backgroundColor: step.completed
                              ? colors.tertiary
                              : colors.surfaceContainerHighest,
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Title and Details */}
                  <View style={[styles.timelineContent, { paddingBottom: isLast ? 0 : Spacing.md }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        style={[
                          Typography.labelLg,
                          {
                            color: step.completed || step.current ? colors.textPrimary : colors.textTertiary,
                            fontWeight: step.current ? '800' : '600',
                          },
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
                        {step.date}
                      </Text>
                    </View>

                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, marginTop: 2 },
                      ]}
                    >
                      {step.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </VoltCard>

        {/* Ordered Items List */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Ordered Hardware ({order.items.length})
          </Text>

          {order.items.map((item: CartItem) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => navigate('product_detail', { productId: item.product.id })}
              style={styles.itemRow}
            >
              <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text numberOfLines={1} style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {item.product.name}
                </Text>
                {item.selectedVariants && (
                  <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                    {Object.entries(item.selectedVariants)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' • ')}
                  </Text>
                )}
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                  Qty: {item.quantity} × ₹{item.priceAtAddition.toLocaleString('en-IN')}
                </Text>
              </View>

              <Text style={[Typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
                ₹{(item.priceAtAddition * item.quantity).toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </VoltCard>

        {/* Delivery Address & Payment Info */}
        <VoltCard variant="glass" style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="location-sharp" size={18} color={colors.primary} />
            <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginLeft: 6 }]}>
              Shipping & Razorpay Details
            </Text>
          </View>

          <View style={{ marginTop: Spacing.sm }}>
            <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
              {order.shippingAddress.fullName} ({order.shippingAddress.type})
            </Text>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary, marginTop: 2 }]}>
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
            </Text>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 4 }]}>
              Phone: {order.shippingAddress.phone}
            </Text>

            <View style={[styles.paymentBanner, { backgroundColor: colors.surfaceContainerLow }]}>
              <Ionicons name="card" size={16} color={colors.tertiary} />
              <View style={{ marginLeft: Spacing.xs, flex: 1 }}>
                <Text style={[Typography.labelSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Paid via Razorpay ({order.paymentDetails.method})
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
                  ID: {order.paymentDetails.razorpayPaymentId} • Status: {order.paymentDetails.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </VoltCard>

        {/* Invoice Summary */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Tax Invoice Breakdown
          </Text>

          <View style={styles.invoiceRow}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>Items Subtotal</Text>
            <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>
              ₹{order.subtotal.toLocaleString('en-IN')}
            </Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.invoiceRow}>
              <Text style={[Typography.bodyMd, { color: colors.tertiary }]}>
                Coupon Discount ({order.couponCode})
              </Text>
              <Text style={[Typography.bodyMd, { color: colors.tertiary, fontWeight: '700' }]}>
                -₹{order.discount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={styles.invoiceRow}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>Express Air Logistics</Text>
            <Text style={[Typography.labelMd, { color: colors.tertiary, fontWeight: '700' }]}>
              {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
            </Text>
          </View>

          <View style={styles.invoiceRow}>
            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>GST Component (18%)</Text>
            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
              ₹{order.tax.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.invoiceRow}>
            <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '800' }]}>
              Total Paid
            </Text>
            <Text style={[Typography.priceHero, { color: colors.primary }]}>
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </VoltCard>

        {/* Download Invoice & Need Help Actions */}
        <View style={styles.actionButtons}>
          <VoltButton
            title={invoiceDownloaded ? 'Invoice Downloaded (PDF)' : 'Download GST Tax Invoice'}
            variant="outline"
            icon={<Ionicons name="document-text-outline" size={18} color={colors.primary} />}
            onPress={handleDownloadInvoice}
          />

          <VoltButton
            title="Need Help with this Order?"
            variant="secondary"
            icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.onSecondary} />}
            onPress={() => navigate('help_support')}
          />

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleCancelOrder} style={styles.cancelBtn}>
              <Text style={[Typography.labelMd, { color: colors.error }]}>Cancel This Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  backBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Roundness.md,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 48,
  },
  statusHeaderCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  courierInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Roundness.sm,
    marginTop: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  timelineContainer: {
    marginTop: Spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 3,
  },
  timelineContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  itemImage: {
    width: 52,
    height: 52,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Roundness.sm,
    marginTop: Spacing.sm,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  actionButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
