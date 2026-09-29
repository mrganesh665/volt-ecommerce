import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltPrice } from '../../components/common/VoltPrice';

export const CartScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const {
    items,
    totals,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponMsg('');
    const res = await applyCoupon(couponInput);
    setApplying(false);
    setCouponMsg(res.message);
    setCouponError(!res.success);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={`Shopping Cart (${totals.itemsCount})`}
        showLogo={false}
        showDelivery={false}
        rightAction={
          items.length > 0 ? (
            <TouchableOpacity activeOpacity={0.7} onPress={clearCart}>
              <Text style={[Typography.labelMd, { color: colors.error }]}>Clear</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {items.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Free Shipping Tier Banner */}
          <View style={[styles.freeShippingCard, { backgroundColor: colors.surfaceContainerLow }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="local-shipping" size={20} color={colors.tertiary} />
              <Text
                style={[
                  Typography.labelMd,
                  { color: colors.tertiary, marginLeft: Spacing.xs, fontWeight: '700' },
                ]}
              >
                {totals.shippingFee === 0
                  ? 'FREE Express Air Delivery Applied!'
                  : `Add ₹${(999 - totals.subtotal).toLocaleString('en-IN')} more for Free Air Delivery`}
              </Text>
            </View>
            <View style={[styles.shippingTrack, { backgroundColor: colors.surfaceContainerHigh }]}>
              <View
                style={[
                  styles.shippingBar,
                  {
                    width: `${Math.min(100, (totals.subtotal / 999) * 100)}%`,
                    backgroundColor: colors.tertiary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Cart Items List */}
          <View style={styles.itemsList}>
            {items.map((item) => {
              const unitPrice = item.priceAtAddition || item.product.price;

              return (
                <VoltCard key={item.id} variant="glass" style={styles.cartItemCard}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigate('product_detail', { productId: item.product.id })}
                  >
                    <Image
                      source={{ uri: item.product.images[0] }}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <View style={styles.itemInfoCol}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          Typography.labelLg,
                          { color: colors.textPrimary, fontWeight: '700', flex: 1 },
                        ]}
                      >
                        {item.product.name}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => removeFromCart(item.id)}
                        style={{ padding: 2 }}
                      >
                        <Ionicons name="trash-outline" size={17} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>

                    {item.selectedVariants && (
                      <Text style={[Typography.bodySm, { color: colors.textTertiary, marginVertical: 2 }]}>
                        {Object.entries(item.selectedVariants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ')}
                      </Text>
                    )}

                    <View style={styles.itemPriceAndStepperRow}>
                      <VoltPrice price={unitPrice} originalPrice={item.product.originalPrice} size="sm" />

                      {/* Quantity Stepper */}
                      <View
                        style={[
                          styles.stepperContainer,
                          {
                            backgroundColor: colors.surfaceContainerHigh,
                            borderColor: colors.divider,
                          },
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          style={styles.stepBtn}
                        >
                          <Ionicons name="remove" size={14} color={colors.textPrimary} />
                        </TouchableOpacity>

                        <Text style={[Typography.labelMd, { color: colors.textPrimary, marginHorizontal: 8 }]}>
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          style={styles.stepBtn}
                        >
                          <Ionicons name="add" size={14} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </VoltCard>
              );
            })}
          </View>

          {/* Coupon Code Section */}
          <VoltCard variant="glass" style={styles.couponCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
              <Text
                style={[
                  Typography.labelMd,
                  { color: colors.textPrimary, fontWeight: '700', marginLeft: Spacing.xs },
                ]}
              >
                Apply Promo Code
              </Text>
            </View>

            {appliedCoupon ? (
              <View
                style={[
                  styles.appliedCouponRow,
                  { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.tertiary },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.labelMd, { color: colors.tertiary, fontWeight: '800' }]}>
                    {appliedCoupon.code} APPLIED
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.tertiary, fontSize: 11 }]}>
                    {appliedCoupon.description}
                  </Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={removeCoupon}>
                  <Text style={[Typography.labelSm, { color: colors.error, fontWeight: '700' }]}>
                    REMOVE
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  placeholder="Enter code (e.g. CYBERVOLT)"
                  placeholderTextColor={colors.textTertiary}
                  value={couponInput}
                  onChangeText={(t) => {
                    setCouponInput(t);
                    setCouponMsg('');
                  }}
                  autoCapitalize="characters"
                  style={[
                    styles.couponInput,
                    Typography.bodyMd,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.textPrimary,
                      borderColor: colors.divider,
                    },
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleApplyCoupon}
                  disabled={applying}
                  style={[styles.applyBtn, { backgroundColor: colors.primaryContainer }]}
                >
                  <Text
                    style={[
                      Typography.labelMd,
                      { color: colors.onPrimaryContainer, fontWeight: '700' },
                    ]}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {couponMsg ? (
              <Text
                style={[
                  Typography.bodySm,
                  {
                    color: couponError ? colors.error : colors.tertiary,
                    marginTop: Spacing.xs,
                  },
                ]}
              >
                {couponMsg}
              </Text>
            ) : null}

            {/* Quick Coupon Suggestions */}
            <View style={styles.suggestionsRow}>
              <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>TRY: </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCouponInput('CYBERVOLT')}>
                <Text style={[Typography.labelSm, { color: colors.primary, textDecorationLine: 'underline' }]}>
                  CYBERVOLT (₹1,500 OFF)
                </Text>
              </TouchableOpacity>
              <Text style={[Typography.labelSm, { color: colors.textTertiary }]}> • </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCouponInput('VOLT500')}>
                <Text style={[Typography.labelSm, { color: colors.primary, textDecorationLine: 'underline' }]}>
                  VOLT500 (₹500 OFF)
                </Text>
              </TouchableOpacity>
            </View>
          </VoltCard>

          {/* Price Breakdown Card */}
          <VoltCard variant="glass" style={styles.summaryCard}>
            <Text
              style={[
                Typography.headlineSm,
                { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm },
              ]}
            >
              Order Breakdown
            </Text>

            <View style={styles.breakdownRow}>
              <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
                Items Subtotal ({totals.itemsCount} hardware)
              </Text>
              <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>
                ₹{totals.subtotal.toLocaleString('en-IN')}
              </Text>
            </View>

            {totals.couponDiscount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[Typography.bodyMd, { color: colors.tertiary }]}>
                  VIP Promo Code ({totals.appliedCoupon?.code})
                </Text>
                <Text style={[Typography.bodyMd, { color: colors.tertiary, fontWeight: '700' }]}>
                  -₹{totals.couponDiscount.toLocaleString('en-IN')}
                </Text>
              </View>
            )}

            <View style={styles.breakdownRow}>
              <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
                Express Air Logistics
              </Text>
              <Text style={[Typography.labelMd, { color: colors.tertiary, fontWeight: '700' }]}>
                {totals.shippingFee === 0 ? 'FREE' : `₹${totals.shippingFee}`}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                GST Tax Component (18% Included)
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                ₹{totals.tax.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <View style={styles.totalRow}>
              <View>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '800' }]}>
                  Total Amount
                </Text>
                {totals.totalSavings > 0 && (
                  <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '700' }]}>
                    Total Savings ₹{totals.totalSavings.toLocaleString('en-IN')}
                  </Text>
                )}
              </View>
              <Text style={[Typography.priceHero, { color: colors.primary }]}>
                ₹{totals.totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </VoltCard>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceContainer }]}>
            <Ionicons name="cart-outline" size={44} color={colors.textTertiary} />
          </View>
          <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
            Your Cart is Empty
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
            ]}
          >
            Add items from our flagship silicon laptops, studio audio, and smart accessories to
            checkout.
          </Text>
          <VoltButton
            title="Browse Deals"
            onPress={() => navigate('home')}
            style={{ marginTop: Spacing.lg, width: 220 }}
          />
        </View>
      )}

      {/* Sticky Bottom Checkout Bar */}
      {items.length > 0 && (
        <View
          style={[
            styles.bottomStickyBar,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderTopColor: colors.divider,
            },
          ]}
        >
          <View>
            <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>PAYABLE AMOUNT</Text>
            <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 22 }]}>
              ₹{totals.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigate('checkout')}
            style={[styles.checkoutBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <Text
              style={[
                Typography.labelLg,
                { color: colors.onPrimaryContainer, fontWeight: '800', marginRight: Spacing.xs },
              ]}
            >
              Proceed to Checkout
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.onPrimaryContainer} />
          </TouchableOpacity>
        </View>
      )}
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
  freeShippingCard: {
    padding: Spacing.md,
    borderRadius: Roundness.md,
    marginBottom: Spacing.md,
  },
  shippingTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  shippingBar: {
    height: '100%',
    borderRadius: 2,
  },
  itemsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cartItemCard: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemInfoCol: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  itemPriceAndStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Roundness.sm,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderRadius: Roundness.sm,
    borderWidth: 1,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  couponInput: {
    flex: 1,
    height: 42,
    borderRadius: Roundness.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  applyBtn: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: Roundness.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  summaryCard: {
    padding: Spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomStickyBar: {
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
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Roundness.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
