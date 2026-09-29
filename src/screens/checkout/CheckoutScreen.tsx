import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { useAddress } from '../../context/AddressContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltBadge } from '../../components/common/VoltBadge';

export const CheckoutScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { items, totals } = useCart();
  const { selectedAddress } = useAddress();

  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'standard'>('express');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="Order Checkout" showLogo={false} showDelivery={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Stepper matching Stitch design */}
        <VoltCard variant="flat" style={styles.stepperCard}>
          <View style={styles.stepperRow}>
            {/* Step 1: Cart */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="checkmark" size={14} color={colors.onTertiary} />
              </View>
              <Text style={[Typography.labelSm, { color: colors.tertiary, marginTop: 4 }]}>Cart</Text>
            </View>

            <View style={[styles.stepLine, { backgroundColor: colors.tertiary }]} />

            {/* Step 2: Address (Current) */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  { backgroundColor: colors.primaryContainer, borderColor: colors.primary, borderWidth: 2 },
                ]}
              >
                <Ionicons name="location" size={14} color={colors.onPrimaryContainer} />
              </View>
              <Text style={[Typography.labelSm, { color: colors.primary, fontWeight: '800', marginTop: 4 }]}>
                Address
              </Text>
            </View>

            <View style={[styles.stepLine, { backgroundColor: colors.surfaceVariant }]} />

            {/* Step 3: Payment */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="flash" size={14} color={colors.textTertiary} />
              </View>
              <Text style={[Typography.labelSm, { color: colors.textTertiary, marginTop: 4 }]}>Payment</Text>
            </View>
          </View>
        </VoltCard>

        {/* Selected Delivery Address Card */}
        <VoltCard variant="glass" style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location-sharp" size={18} color={colors.primary} />
              <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginLeft: 6 }]}>
                Shipping Address
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('address_select')}>
              <Text style={[Typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={{ marginTop: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {selectedAddress.fullName}
                </Text>
                <VoltBadge label={selectedAddress.type} variant="cyan" size="sm" style={{ marginLeft: 6 }} />
              </View>

              <Text style={[Typography.bodyMd, { color: colors.textSecondary, marginTop: 4 }]}>
                {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
              </Text>

              <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </Text>

              <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 4 }]}>
                Phone: {selectedAddress.phone}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigate('address_select')}
              style={{ paddingVertical: Spacing.md }}
            >
              <Text style={[Typography.labelMd, { color: colors.error }]}>
                No address selected. Tap to add or select delivery address.
              </Text>
            </TouchableOpacity>
          )}
        </VoltCard>

        {/* Delivery Speed Options */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Delivery Speed
          </Text>

          {/* Express Next-Day */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setDeliverySpeed('express')}
            style={[
              styles.speedOption,
              {
                backgroundColor:
                  deliverySpeed === 'express' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: deliverySpeed === 'express' ? colors.primary : colors.divider,
                borderWidth: deliverySpeed === 'express' ? 1.5 : 1,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: deliverySpeed === 'express' ? colors.primary : colors.outline,
                    backgroundColor: deliverySpeed === 'express' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {deliverySpeed === 'express' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                    Express Air Delivery
                  </Text>
                  <VoltBadge label="VIP PRIORITY" variant="emerald" size="sm" style={{ marginLeft: 6 }} />
                </View>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                  Guaranteed delivery by Tomorrow 2:00 PM via BlueDart Air
                </Text>
              </View>
            </View>
            <Text style={[Typography.labelMd, { color: colors.tertiary, fontWeight: '800' }]}>
              FREE
            </Text>
          </TouchableOpacity>

          {/* Standard Delivery */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setDeliverySpeed('standard')}
            style={[
              styles.speedOption,
              {
                backgroundColor:
                  deliverySpeed === 'standard' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: deliverySpeed === 'standard' ? colors.primary : colors.divider,
                borderWidth: deliverySpeed === 'standard' ? 1.5 : 1,
                marginTop: Spacing.sm,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: deliverySpeed === 'standard' ? colors.primary : colors.outline,
                    backgroundColor: deliverySpeed === 'standard' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {deliverySpeed === 'standard' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Standard Ground Transit
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                  Delivered in 3-5 business days
                </Text>
              </View>
            </View>
            <Text style={[Typography.labelMd, { color: colors.textSecondary }]}>FREE</Text>
          </TouchableOpacity>
        </VoltCard>

        {/* Order Items Preview */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Order Items ({items.length})
          </Text>

          {items.map((item) => (
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
        </VoltCard>

        {/* Price Breakdown */}
        <VoltCard variant="glass" style={styles.card}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Payment Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>Items Subtotal</Text>
            <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>
              ₹{totals.subtotal.toLocaleString('en-IN')}
            </Text>
          </View>

          {totals.couponDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[Typography.bodyMd, { color: colors.tertiary }]}>
                Coupon Discount ({totals.appliedCoupon?.code})
              </Text>
              <Text style={[Typography.bodyMd, { color: colors.tertiary, fontWeight: '700' }]}>
                -₹{totals.couponDiscount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>Delivery Fee</Text>
            <Text style={[Typography.labelMd, { color: colors.tertiary, fontWeight: '700' }]}>FREE</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.summaryRow}>
            <View>
              <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '800' }]}>
                Payable Amount
              </Text>
              {totals.totalSavings > 0 && (
                <Text style={[Typography.labelSm, { color: colors.tertiary }]}>
                  Total Savings: ₹{totals.totalSavings.toLocaleString('en-IN')}
                </Text>
              )}
            </View>
            <Text style={[Typography.priceHero, { color: colors.primary }]}>
              ₹{totals.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </VoltCard>
      </ScrollView>

      {/* Sticky Bottom Proceed to Razorpay Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderTopColor: colors.divider,
          },
        ]}
      >
        <View>
          <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>TOTAL PAYABLE</Text>
          <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 22 }]}>
            ₹{totals.totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('razorpay_payment')}
          disabled={!selectedAddress}
          style={[
            styles.proceedBtn,
            {
              backgroundColor: selectedAddress ? colors.primaryContainer : colors.surfaceContainer,
            },
          ]}
        >
          <Ionicons name="shield-checkmark" size={18} color={selectedAddress ? colors.onPrimaryContainer : colors.textTertiary} />
          <Text
            style={[
              Typography.labelLg,
              {
                color: selectedAddress ? colors.onPrimaryContainer : colors.textTertiary,
                marginLeft: 6,
                fontWeight: '800',
              },
            ]}
          >
            Pay with Razorpay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 110,
  },
  stepperCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Roundness.md,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Roundness.md,
  },
});
