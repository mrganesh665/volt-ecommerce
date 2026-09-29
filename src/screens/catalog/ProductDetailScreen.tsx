import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { VoltPrice } from '../../components/common/VoltPrice';
import { VoltRating } from '../../components/common/VoltRating';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltCard } from '../../components/common/VoltCard';

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute, goBack, navigate } = useNavigation();
  const { getProductById } = useCatalog();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useWishlist();

  const productId = currentRoute.params?.productId;
  const product = getProductById(productId);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
        <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
          Product Not Found
        </Text>
        <TouchableOpacity
          onPress={() => goBack()}
          style={[styles.backHomeBtn, { backgroundColor: colors.primaryContainer }]}
        >
          <Text style={[Typography.labelLg, { color: colors.onPrimaryContainer }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  // Compute price based on selected variants
  let computedPrice = product.price;
  if (product.variants) {
    for (const [varName, val] of Object.entries(selectedVariants)) {
      const v = product.variants.find((v) => v.name === varName);
      const opt = v?.options.find((o) => o.value === val);
      if (opt?.priceDelta) computedPrice += opt.priceDelta;
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    navigate('cart');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Floating App Bar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goBack()}
          style={[styles.topBarBtn, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleFavorite(product)}
            style={[styles.topBarBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isFav ? colors.error : colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('cart')}
            style={[styles.topBarBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons name="cart-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image Stage */}
        <View style={[styles.imageStage, { backgroundColor: colors.surfaceContainerLow }]}>
          <Image
            source={{ uri: product.images[activeImageIdx] || product.images[0] }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Dots Indicator */}
          {product.images.length > 1 && (
            <View style={styles.paginationDots}>
              {product.images.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  onPress={() => setActiveImageIdx(i)}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === activeImageIdx ? colors.primary : colors.surfaceVariant,
                      width: i === activeImageIdx ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Identity & Pricing */}
        <View style={styles.bodySection}>
          <View style={styles.tagRow}>
            <VoltBadge label={product.brand} variant="cyan" size="md" />
            {product.inStock ? (
              <VoltBadge label="In Stock" variant="emerald" size="md" />
            ) : (
              <VoltBadge label="Out of Stock" variant="error" size="md" />
            )}
          </View>

          <Text style={[Typography.headlineLg, { color: colors.textPrimary, marginVertical: Spacing.xs }]}>
            {product.name}
          </Text>

          <Text style={[Typography.bodyMd, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
            {product.tagline}
          </Text>

          <View style={styles.ratingRow}>
            <VoltRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            <Text style={[Typography.bodySm, { color: colors.primary, marginLeft: Spacing.sm }]}>
              Verified Hardware Purchase
            </Text>
          </View>

          {/* Price Card */}
          <VoltCard variant="elevated" style={styles.priceCard}>
            <View style={styles.priceRow}>
              <View>
                <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>OFFICIAL PRICE</Text>
                <View>
                  <VoltPrice
                    price={computedPrice}
                    originalPrice={product.originalPrice}
                    size="hero"
                  />
                </View>
              </View>

              <View
                style={[
                  styles.savingsBox,
                  { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.tertiary },
                ]}
              >
                <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '800' }]}>
                  SAVE ₹{(product.originalPrice - computedPrice).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </VoltCard>

          {/* Variant Selectors (e.g. Storage, Color) */}
          {product.variants &&
            product.variants.map((v) => {
              const currentChoice = selectedVariants[v.name] || v.options[0].value;

              return (
                <View key={v.id} style={styles.variantSection}>
                  <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                    Select {v.name}:{' '}
                    <Text style={{ color: colors.primary }}>
                      {v.options.find((o) => o.value === currentChoice)?.label}
                    </Text>
                  </Text>

                  <View style={styles.variantOptionsRow}>
                    {v.options.map((opt) => {
                      const isSelected = currentChoice === opt.value;

                      return (
                        <TouchableOpacity
                          key={opt.value}
                          activeOpacity={0.8}
                          onPress={() =>
                            setSelectedVariants((prev) => ({ ...prev, [v.name]: opt.value }))
                          }
                          style={[
                            styles.variantPill,
                            {
                              backgroundColor: isSelected
                                ? colors.surfaceContainerHigh
                                : colors.surfaceContainerLowest,
                              borderColor: isSelected ? colors.primary : colors.outlineVariant,
                              borderWidth: isSelected ? 1.5 : 1,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              Typography.labelMd,
                              {
                                color: isSelected ? colors.primary : colors.textSecondary,
                                fontWeight: isSelected ? '700' : '500',
                              },
                            ]}
                          >
                            {opt.label}
                          </Text>
                          {!!opt.priceDelta && opt.priceDelta > 0 && (
                            <Text style={[Typography.labelSm, { color: colors.textTertiary, marginTop: 2 }]}>
                              +₹{opt.priceDelta.toLocaleString('en-IN')}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
              Product Overview
            </Text>
            <Text
              style={[
                Typography.bodyMd,
                { color: colors.textSecondary, lineHeight: 22, marginTop: Spacing.xs },
              ]}
            >
              {product.description}
            </Text>
          </View>

          {/* Technical Specifications Accordion Table */}
          {product.specs && product.specs.length > 0 && (
            <View style={styles.specsSection}>
              <Text
                style={[
                  Typography.headlineSm,
                  { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm },
                ]}
              >
                Technical Specifications
              </Text>

              {product.specs.map((group, gIdx) => (
                <VoltCard key={gIdx} variant="glass" style={styles.specGroupCard}>
                  <Text
                    style={[
                      Typography.labelLg,
                      { color: colors.primary, fontWeight: '800', marginBottom: Spacing.sm },
                    ]}
                  >
                    {group.group}
                  </Text>

                  {group.items.map((item, iIdx) => (
                    <View
                      key={iIdx}
                      style={[
                        styles.specRow,
                        {
                          borderBottomColor: colors.divider,
                          borderBottomWidth: iIdx < group.items.length - 1 ? 1 : 0,
                        },
                      ]}
                    >
                      <Text style={[Typography.bodySm, { color: colors.textTertiary, flex: 1 }]}>
                        {item.label}
                      </Text>
                      <Text
                        style={[
                          Typography.labelMd,
                          { color: colors.textPrimary, flex: 1.5, textAlign: 'right' },
                        ]}
                      >
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </VoltCard>
              ))}
            </View>
          )}

          {/* Official Warranty & Guarantee Badges */}
          <VoltCard variant="glass" style={styles.guaranteeCard}>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="security" size={24} color={colors.primary} />
              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {product.warranty || '2-Year Official Brand Warranty'}
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Valid across 2,400+ authorized brand centers nationwide
                </Text>
              </View>
            </View>

            <View style={[styles.guaranteeItem, { marginTop: Spacing.md }]}>
              <MaterialIcons name="local-shipping" size={24} color={colors.tertiary} />
              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <Text style={[Typography.labelMd, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Free Express Air Logistics
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Delivered via BlueDart Express Air with temperature-controlled transit
                </Text>
              </View>
            </View>
          </VoltCard>
        </View>
      </ScrollView>

      {/* Added Toast */}
      {addedToast && (
        <View style={[styles.toast, { backgroundColor: colors.surfaceContainerHighest }]}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tertiary} />
          <Text style={[Typography.labelMd, { color: colors.textPrimary, marginLeft: 6 }]}>
            Added to your shopping cart!
          </Text>
        </View>
      )}

      {/* Sticky Bottom Actions Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderTopColor: colors.divider,
          },
        ]}
      >
        <View style={styles.bottomPriceCol}>
          <Text style={[Typography.labelSm, { color: colors.textTertiary }]}>Total Amount</Text>
          <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 20 }]}>
            ₹{computedPrice.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddToCart}
            style={[
              styles.cartBtn,
              {
                backgroundColor: inCart ? colors.surfaceContainerHigh : colors.surfaceContainer,
                borderColor: colors.primary,
                borderWidth: inCart ? 1.5 : 1,
              },
            ]}
          >
            <Ionicons
              name={inCart ? 'checkmark' : 'cart-outline'}
              size={18}
              color={inCart ? colors.primary : colors.textPrimary}
            />
            <Text
              style={[
                Typography.labelMd,
                { color: inCart ? colors.primary : colors.textPrimary, marginLeft: 6, fontWeight: '700' },
              ]}
            >
              {inCart ? 'Added' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBuyNow}
            style={[styles.buyBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <Ionicons name="flash" size={18} color={colors.onPrimaryContainer} />
            <Text
              style={[
                Typography.labelLg,
                { color: colors.onPrimaryContainer, marginLeft: 6, fontWeight: '800' },
              ]}
            >
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backHomeBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Roundness.md,
  },
  topBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  topBarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageStage: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: width * 0.85,
    height: 230,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  bodySection: {
    padding: Spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  priceCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingsBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.sm,
    borderWidth: 1,
    alignItems: 'flex-end',
  },
  variantSection: {
    marginBottom: Spacing.lg,
  },
  variantOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  variantPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Roundness.md,
    alignItems: 'center',
  },
  descriptionSection: {
    marginBottom: Spacing.lg,
  },
  specsSection: {
    marginBottom: Spacing.lg,
  },
  specGroupCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  guaranteeCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 90,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: Roundness.md,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  bottomPriceCol: {
    justifyContent: 'center',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: Spacing.md,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: Roundness.md,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 46,
    borderRadius: Roundness.md,
  },
});
