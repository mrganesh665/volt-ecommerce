import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { useAddress } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { paymentService } from '../../services/payment.service';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltBadge } from '../../components/common/VoltBadge';
import { PaymentMethodType } from '../../types';

export const RazorpayPaymentScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate, goBack } = useNavigation();
  const { items, totals, clearCart } = useCart();
  const { selectedAddress } = useAddress();
  const { user } = useAuth();
  const { placeOrder } = useOrder();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi_gpay');
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Custom UPI VPA
  const [customVpa, setCustomVpa] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [saveCard, setSaveCard] = useState(true);

  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Razorpay Gateway Modal State
  const [processing, setProcessing] = useState(false);
  const [modalStage, setModalStage] = useState<'connecting' | 'authorizing' | 'success' | 'failed'>('connecting');
  const [gatewayError, setGatewayError] = useState('');

  const handlePay = async () => {
    setGatewayError('');
    setProcessing(true);
    setModalStage('connecting');

    const paymentRes = await paymentService.processPayment({
      amount: totals.totalAmount,
      method: selectedMethod,
      vpa: selectedMethod === 'upi_custom' ? customVpa : undefined,
      cardDetails:
        selectedMethod === 'card'
          ? {
              number: cardNumber,
              expiry: cardExpiry,
              cvv: cardCvv,
              name: cardName,
            }
          : undefined,
      bankName: selectedMethod === 'netbanking' ? selectedBank : undefined,
      customerEmail: user?.email || 'customer@volttech.io',
      customerPhone: user?.phone || '+91 98765 43210',
    });

    if (!paymentRes.success || !paymentRes.details) {
      setModalStage('failed');
      setGatewayError(paymentRes.error || 'Payment authorization failed');
      return;
    }

    setModalStage('authorizing');
    await new Promise((r) => setTimeout(r, 600));

    // Place actual order in system
    if (!selectedAddress) {
      setModalStage('failed');
      setGatewayError('No shipping address selected.');
      return;
    }

    const createdOrder = await placeOrder({
      userId: user?.id || 'user-default',
      customerName: user?.name || selectedAddress.fullName,
      customerEmail: user?.email || 'customer@volttech.io',
      customerPhone: user?.phone || selectedAddress.phone,
      items,
      shippingAddress: selectedAddress,
      paymentMethod: selectedMethod,
      paymentDetails: paymentRes.details,
      subtotal: totals.subtotal,
      discount: totals.couponDiscount,
      couponCode: totals.appliedCoupon?.code,
      shippingFee: totals.shippingFee,
      tax: totals.tax,
      totalAmount: totals.totalAmount,
    });

    setModalStage('success');
    await new Promise((r) => setTimeout(r, 800));

    // Clean cart and route to order success
    clearCart();
    setProcessing(false);
    navigate('order_success', { orderId: createdOrder.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
            Secure Razorpay Checkout
          </Text>
          <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
            256-Bit SSL Encrypted Gateway
          </Text>
        </View>

        <View style={[styles.shieldIcon, { backgroundColor: colors.surfaceContainerHigh }]}>
          <MaterialIcons name="security" size={18} color={colors.tertiary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Stepper */}
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

            {/* Step 2: Address */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="checkmark" size={14} color={colors.onTertiary} />
              </View>
              <Text style={[Typography.labelSm, { color: colors.tertiary, marginTop: 4 }]}>Address</Text>
            </View>

            <View style={[styles.stepLine, { backgroundColor: colors.tertiary }]} />

            {/* Step 3: Payment (Active) */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  { backgroundColor: colors.primaryContainer, borderColor: colors.primary, borderWidth: 2 },
                ]}
              >
                <Ionicons name="flash" size={14} color={colors.onPrimaryContainer} />
              </View>
              <Text style={[Typography.labelSm, { color: colors.primary, fontWeight: '800', marginTop: 4 }]}>
                Payment
              </Text>
            </View>
          </View>
        </VoltCard>

        {/* Amount Payable Card */}
        <VoltCard variant="glass" style={styles.priceCard}>
          <View style={styles.priceCardRow}>
            <View>
              <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>AMOUNT PAYABLE</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                <Text style={[Typography.priceHero, { color: colors.primary }]}>
                  ₹{totals.totalAmount.toLocaleString('en-IN')}
                </Text>
                {totals.totalSavings > 0 && (
                  <View style={[styles.savingsBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '700' }]}>
                      Savings ₹{totals.totalSavings.toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPriceBreakdown(!showPriceBreakdown)}
              style={[styles.breakdownToggle, { backgroundColor: colors.surfaceContainerHigh }]}
            >
              <Text style={[Typography.labelSm, { color: colors.primary }]}>Details</Text>
              <Ionicons
                name={showPriceBreakdown ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {showPriceBreakdown && (
            <View style={[styles.breakdownExpanded, { borderTopColor: colors.divider }]}>
              <View style={styles.breakdownRow}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Items Subtotal ({totals.itemsCount} hardware)
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textPrimary }]}>
                  ₹{totals.subtotal.toLocaleString('en-IN')}
                </Text>
              </View>

              {totals.couponDiscount > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={[Typography.bodySm, { color: colors.tertiary }]}>
                    VIP Coupon ({totals.appliedCoupon?.code})
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.tertiary, fontWeight: '700' }]}>
                    -₹{totals.couponDiscount.toLocaleString('en-IN')}
                  </Text>
                </View>
              )}

              <View style={styles.breakdownRow}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Express Air Logistics
                </Text>
                <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '700' }]}>
                  FREE
                </Text>
              </View>
            </View>
          )}

          {/* Trust Banner */}
          <View style={[styles.trustBanner, { backgroundColor: colors.surfaceContainerLowest }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="verified-user" size={16} color={colors.tertiary} />
              <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: 6, fontSize: 11 }]}>
                Razorpay 256-Bit Bank Encryption
              </Text>
            </View>
            <View style={[styles.testBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[Typography.labelSm, { color: colors.primary, fontSize: 10 }]}>
                TEST SANDBOX
              </Text>
            </View>
          </View>
        </VoltCard>

        {/* Payment Methods Section 1: UPI Options */}
        <VoltCard variant="glass" style={styles.methodGroupCard}>
          <View style={styles.groupHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.methodIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="wallet-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  UPI & Instant Pay
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Zero fees • Instant bank clearance
                </Text>
              </View>
            </View>
            <VoltBadge label="FASTEST" variant="emerald" size="sm" />
          </View>

          {/* Cashback Callout */}
          <View style={[styles.cashbackBox, { backgroundColor: colors.surfaceContainerLow }]}>
            <Ionicons name="gift-outline" size={16} color={colors.tertiary} />
            <Text style={[Typography.bodySm, { color: colors.textPrimary, marginLeft: 6, flex: 1, fontSize: 12 }]}>
              Get up to <Text style={{ color: colors.tertiary, fontWeight: '700' }}>₹250 instant cashback</Text> on Google Pay & PhonePe transactions.
            </Text>
          </View>

          {/* Google Pay */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('upi_gpay')}
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  selectedMethod === 'upi_gpay' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: selectedMethod === 'upi_gpay' ? colors.primary : colors.divider,
                borderWidth: selectedMethod === 'upi_gpay' ? 1.5 : 1,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'upi_gpay' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'upi_gpay' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'upi_gpay' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Google Pay
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Instant UPI auto-redirect
                </Text>
              </View>
            </View>

            {selectedMethod === 'upi_gpay' && (
              <VoltBadge label="SELECTED" variant="cyan" size="sm" />
            )}
          </TouchableOpacity>

          {/* PhonePe */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('upi_phonepe')}
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  selectedMethod === 'upi_phonepe' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: selectedMethod === 'upi_phonepe' ? colors.primary : colors.divider,
                borderWidth: selectedMethod === 'upi_phonepe' ? 1.5 : 1,
                marginTop: Spacing.xs,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'upi_phonepe' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'upi_phonepe' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'upi_phonepe' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  PhonePe UPI
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Fast UPI link
                </Text>
              </View>
            </View>

            <VoltBadge label="OFFER ELIGIBLE" variant="emerald" size="sm" />
          </TouchableOpacity>

          {/* Paytm */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('upi_paytm')}
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  selectedMethod === 'upi_paytm' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: selectedMethod === 'upi_paytm' ? colors.primary : colors.divider,
                borderWidth: selectedMethod === 'upi_paytm' ? 1.5 : 1,
                marginTop: Spacing.xs,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'upi_paytm' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'upi_paytm' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'upi_paytm' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Paytm UPI
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Direct wallet / UPI
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Custom UPI ID */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('upi_custom')}
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  selectedMethod === 'upi_custom' ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                borderColor: selectedMethod === 'upi_custom' ? colors.primary : colors.divider,
                borderWidth: selectedMethod === 'upi_custom' ? 1.5 : 1,
                marginTop: Spacing.xs,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'upi_custom' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'upi_custom' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'upi_custom' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Enter UPI ID (VPA)
                </Text>
                {selectedMethod === 'upi_custom' ? (
                  <TextInput
                    placeholder="e.g. yourname@okhdfcbank"
                    placeholderTextColor={colors.textTertiary}
                    value={customVpa}
                    onChangeText={setCustomVpa}
                    autoCapitalize="none"
                    style={[
                      styles.vpaInput,
                      Typography.bodyMd,
                      {
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.textPrimary,
                        borderColor: colors.divider,
                      },
                    ]}
                  />
                ) : (
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    Pay using any bank UPI address
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </VoltCard>

        {/* Section 2: Credit / Debit Card */}
        <VoltCard variant="glass" style={styles.methodGroupCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('card')}
            style={styles.groupHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'card' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'card' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'card' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Credit / Debit Card
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Visa, MasterCard, RuPay, Amex
                </Text>
              </View>
            </View>
            <Ionicons name="card-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          {selectedMethod === 'card' && (
            <View style={styles.cardInputFields}>
              <TextInput
                placeholder="Card Number (16 Digits)"
                placeholderTextColor={colors.textTertiary}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                style={[
                  styles.cardInput,
                  Typography.bodyMd,
                  { backgroundColor: colors.surfaceContainerLowest, color: colors.textPrimary, borderColor: colors.divider },
                ]}
              />

              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <TextInput
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textTertiary}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  style={[
                    styles.cardInput,
                    Typography.bodyMd,
                    { flex: 1, backgroundColor: colors.surfaceContainerLowest, color: colors.textPrimary, borderColor: colors.divider },
                  ]}
                />
                <TextInput
                  placeholder="CVV"
                  placeholderTextColor={colors.textTertiary}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  keyboardType="number-pad"
                  secureTextEntry
                  style={[
                    styles.cardInput,
                    Typography.bodyMd,
                    { flex: 1, backgroundColor: colors.surfaceContainerLowest, color: colors.textPrimary, borderColor: colors.divider },
                  ]}
                />
              </View>

              <TextInput
                placeholder="Name on Card"
                placeholderTextColor={colors.textTertiary}
                value={cardName}
                onChangeText={setCardName}
                style={[
                  styles.cardInput,
                  Typography.bodyMd,
                  { backgroundColor: colors.surfaceContainerLowest, color: colors.textPrimary, borderColor: colors.divider },
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSaveCard(!saveCard)}
                style={styles.saveCardRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: saveCard ? colors.primary : colors.outline,
                      backgroundColor: saveCard ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {saveCard && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
                </View>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>
                  Save card securely for future purchases (RBI compliant tokenization)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </VoltCard>

        {/* Section 3: Netbanking */}
        <VoltCard variant="glass" style={styles.methodGroupCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('netbanking')}
            style={styles.groupHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'netbanking' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'netbanking' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'netbanking' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Net Banking
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Over 50+ supported Indian banks
                </Text>
              </View>
            </View>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          {selectedMethod === 'netbanking' && (
            <View style={styles.bankGrid}>
              {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank) => {
                const isSelectedBank = selectedBank === bank;
                return (
                  <TouchableOpacity
                    key={bank}
                    activeOpacity={0.7}
                    onPress={() => setSelectedBank(bank)}
                    style={[
                      styles.bankPill,
                      {
                        backgroundColor: isSelectedBank ? colors.surfaceContainerHighest : colors.surfaceContainerLowest,
                        borderColor: isSelectedBank ? colors.primary : colors.divider,
                        borderWidth: isSelectedBank ? 1.5 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.labelSm,
                        {
                          color: isSelectedBank ? colors.primary : colors.textPrimary,
                          fontWeight: isSelectedBank ? '800' : '500',
                        },
                      ]}
                    >
                      {bank}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </VoltCard>

        {/* Section 4: Pay Later / EMI */}
        <VoltCard variant="glass" style={styles.methodGroupCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('paylater')}
            style={styles.groupHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'paylater' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'paylater' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'paylater' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Razorpay PayLater & No-Cost EMI
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Pay in 30 days or convert into 3-12 months EMI
                </Text>
              </View>
            </View>
            <VoltBadge label="0% EMI" variant="violet" size="sm" />
          </TouchableOpacity>
        </VoltCard>

        {/* Section 5: Cash on Delivery */}
        <VoltCard variant="glass" style={styles.methodGroupCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('cod')}
            style={styles.groupHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selectedMethod === 'cod' ? colors.primary : colors.outline,
                    backgroundColor: selectedMethod === 'cod' ? colors.primary : 'transparent',
                  },
                ]}
              >
                {selectedMethod === 'cod' && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
              </View>

              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Cash on Delivery (COD)
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Pay at doorstep via cash or delivery agent QR
                </Text>
              </View>
            </View>
            <Ionicons name="cash-outline" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </VoltCard>
      </ScrollView>

      {/* Sticky Bottom Pay Button */}
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
          <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>TOTAL</Text>
          <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 22 }]}>
            ₹{totals.totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePay}
          style={[styles.payNowBtn, { backgroundColor: colors.primaryContainer }]}
        >
          <Ionicons name="flash" size={18} color={colors.onPrimaryContainer} />
          <Text
            style={[
              Typography.labelLg,
              { color: colors.onPrimaryContainer, fontWeight: '800', marginLeft: 6 },
            ]}
          >
            Authorize Payment
          </Text>
        </TouchableOpacity>
      </View>

      {/* Razorpay Gateway Processing Modal Simulation */}
      <Modal visible={processing} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <VoltCard variant="elevated" style={styles.modalCard}>
            {/* Razorpay Header Branding */}
            <View style={styles.razorpayBrandRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.rzpIcon, { backgroundColor: '#0c2340' }]}>
                  <Text style={{ color: '#58a6ff', fontWeight: '900', fontSize: 16 }}>R</Text>
                </View>
                <View style={{ marginLeft: Spacing.sm }}>
                  <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '800' }]}>
                    Razorpay
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
                    Merchant: VoltTech Electronics
                  </Text>
                </View>
              </View>
              <Text style={[Typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                TEST MODE
              </Text>
            </View>

            <View style={styles.modalContentStage}>
              {modalStage === 'connecting' && (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[Typography.headlineSm, { color: colors.textPrimary, marginTop: Spacing.md }]}>
                    Connecting to Payment Gateway...
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                    Securing 256-bit handshake with Razorpay
                  </Text>
                </>
              )}

              {modalStage === 'authorizing' && (
                <>
                  <ActivityIndicator size="large" color={colors.tertiary} />
                  <Text style={[Typography.headlineSm, { color: colors.textPrimary, marginTop: Spacing.md }]}>
                    Authorizing ₹{totals.totalAmount.toLocaleString('en-IN')}...
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                    Verifying transaction signature and creating order record
                  </Text>
                </>
              )}

              {modalStage === 'success' && (
                <>
                  <View style={[styles.statusCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                    <Ionicons name="checkmark-circle" size={48} color={colors.tertiary} />
                  </View>
                  <Text style={[Typography.headlineSm, { color: colors.tertiary, marginTop: Spacing.md, fontWeight: '800' }]}>
                    Payment Authorized!
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                    Generating order and air dispatch tracking...
                  </Text>
                </>
              )}

              {modalStage === 'failed' && (
                <>
                  <View style={[styles.statusCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                    <Ionicons name="alert-circle" size={48} color={colors.error} />
                  </View>
                  <Text style={[Typography.headlineSm, { color: colors.error, marginTop: Spacing.md, fontWeight: '800' }]}>
                    Payment Failed
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4, textAlign: 'center' }]}>
                    {gatewayError || 'Unable to authorize transaction.'}
                  </Text>
                  <VoltButton
                    title="Try Again"
                    onPress={() => setProcessing(false)}
                    style={{ marginTop: Spacing.md }}
                  />
                </>
              )}
            </View>
          </VoltCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  priceCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  priceCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingsBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.sm,
  },
  breakdownExpanded: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    padding: 8,
    borderRadius: Roundness.sm,
  },
  testBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodGroupCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Roundness.sm,
    marginVertical: Spacing.sm,
  },
  methodOption: {
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
  vpaInput: {
    height: 40,
    borderRadius: Roundness.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  cardInputFields: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  cardInput: {
    height: 42,
    borderRadius: Roundness.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  bankPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Roundness.sm,
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
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Roundness.md,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    padding: Spacing.lg,
  },
  razorpayBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  rzpIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentStage: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statusCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
