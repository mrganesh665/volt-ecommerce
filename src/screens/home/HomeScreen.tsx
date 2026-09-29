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
import { useAuth } from '../../context/AuthContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltPrice } from '../../components/common/VoltPrice';
import { VoltRating } from '../../components/common/VoltRating';
import { VoltButton } from '../../components/common/VoltButton';
import { Product } from '../../types';

const { width } = Dimensions.get('window');
const DEAL_CARD_WIDTH = 260;

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { products, categories, flashDeals, featured } = useCatalog();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useWishlist();
  const { user, isAdmin } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredRecommended =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  const heroDealProduct = products.find((p) => p.id === 'prod-aerosound-pro') || products[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Greeting & VIP Status Banner */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.labelMd, { color: colors.textSecondary }]}>
              Hello, {user?.name ? user.name.split(' ')[0] : 'Tech Enthusiast'} 👋
            </Text>
            <Text style={[Typography.headlineMd, { color: colors.textPrimary, fontWeight: '800' }]}>
              Next-Gen Hardware Deals
            </Text>
          </View>
          <View
            style={[
              styles.vipBadge,
              { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.tertiary },
            ]}
          >
            <View style={[styles.pulseDot, { backgroundColor: colors.tertiary }]} />
            <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '800' }]}>
              VOLT VIP
            </Text>
          </View>
        </View>

        {/* Interactive Search Bar Trigger */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('search')}
          style={[
            styles.searchTrigger,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.divider,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.primary} />
          <Text style={[Typography.bodyMd, { color: colors.textTertiary, marginLeft: Spacing.sm, flex: 1 }]}>
            Search 4K TVs, M3 MacBooks, ANC Audio...
          </Text>
          <View style={[styles.searchFilterIcon, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Ionicons name="options-outline" size={18} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Value Badges Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.valueBadgesContainer}
        >
          <View style={[styles.valueBadge, { backgroundColor: colors.surfaceContainerLow }]}>
            <MaterialIcons name="local-shipping" size={16} color={colors.tertiary} />
            <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 6 }]}>
              Free Next-Day Air
            </Text>
          </View>

          <View style={[styles.valueBadge, { backgroundColor: colors.surfaceContainerLow }]}>
            <MaterialIcons name="verified-user" size={16} color={colors.primary} />
            <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 6 }]}>
              2-Yr Official Warranty
            </Text>
          </View>

          <View style={[styles.valueBadge, { backgroundColor: colors.surfaceContainerLow }]}>
            <MaterialIcons name="cached" size={16} color={colors.secondary} />
            <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 6 }]}>
              7-Day Doorstep Replacement
            </Text>
          </View>
        </ScrollView>

        {/* Hero Promotional Banner */}
        {heroDealProduct && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigate('product_detail', { productId: heroDealProduct.id })}
            style={[
              styles.heroBanner,
              {
                backgroundColor: colors.surfaceContainerHigh,
                borderColor: 'rgba(76, 215, 246, 0.3)',
              },
            ]}
          >
            {/* Ambient cyan rim glow */}
            <View style={styles.ambientGlow} />

            <View style={styles.heroTopRow}>
              <View style={[styles.cyberWeekPill, { backgroundColor: colors.secondaryContainer }]}>
                <Ionicons name="flash" size={12} color={colors.secondaryLight} />
                <Text style={[Typography.labelSm, { color: colors.secondaryLight, marginLeft: 4 }]}>
                  CYBER SOUND WEEK
                </Text>
              </View>

              <View style={[styles.timerPill, { backgroundColor: colors.surfaceContainerLowest }]}>
                <Ionicons name="time-outline" size={13} color={colors.tertiary} />
                <Text style={[Typography.labelSm, { color: colors.tertiary, marginLeft: 4 }]}>
                  Ends in 08h : 42m
                </Text>
              </View>
            </View>

            <View style={styles.heroMainGrid}>
              <View style={{ flex: 1.1, paddingRight: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[Typography.displayLg, { color: colors.primary, fontWeight: '900' }]}>
                    40%
                  </Text>
                  <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginLeft: 6 }]}>
                    OFF
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  style={[Typography.bodyMd, { color: colors.textSecondary, marginTop: 4 }]}
                >
                  Flagship Studio ANC Over-Ear Acoustics with Ultra Low Latency
                </Text>

                <View style={{ marginTop: Spacing.md }}>
                  <VoltButton
                    title="Grab Deal"
                    size="sm"
                    fullWidth={false}
                    icon={<Ionicons name="arrow-forward" size={16} color={colors.onPrimaryContainer} />}
                    iconPosition="right"
                    onPress={() => navigate('product_detail', { productId: heroDealProduct.id })}
                  />
                </View>
              </View>

              <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={{ uri: heroDealProduct.images[0] }}
                  style={styles.heroImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Dots */}
            <View style={styles.carouselDots}>
              <View style={[styles.dotActive, { backgroundColor: colors.primary }]} />
              <View style={[styles.dotInactive, { backgroundColor: colors.surfaceVariant }]} />
              <View style={[styles.dotInactive, { backgroundColor: colors.surfaceVariant }]} />
            </View>
          </TouchableOpacity>
        )}

        {/* Explore Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
            Explore Categories
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('categories')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[Typography.labelMd, { color: colors.primary }]}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveCategory('all')}
            style={styles.categoryItem}
          >
            <View
              style={[
                styles.categoryIconBox,
                {
                  backgroundColor:
                    activeCategory === 'all' ? colors.primaryContainer : colors.surfaceContainer,
                },
              ]}
            >
              <Ionicons
                name="grid"
                size={22}
                color={activeCategory === 'all' ? colors.onPrimaryContainer : colors.primary}
              />
            </View>
            <Text
              style={[
                Typography.labelSm,
                {
                  color: activeCategory === 'all' ? colors.primary : colors.textSecondary,
                  marginTop: 6,
                  fontWeight: activeCategory === 'all' ? '700' : '500',
                },
              ]}
            >
              All Tech
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => {
                  setActiveCategory(cat.id);
                  navigate('product_list', { categoryId: cat.id, title: cat.name });
                }}
                style={styles.categoryItem}
              >
                <View
                  style={[
                    styles.categoryIconBox,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainer,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={cat.iconName as any}
                    size={24}
                    color={isSelected ? colors.onPrimaryContainer : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    Typography.labelSm,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
                      marginTop: 6,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Flash Deals Horizontal Carousel */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="flame" size={22} color={colors.error} />
            <Text
              style={[
                Typography.headlineSm,
                { color: colors.textPrimary, fontWeight: '700', marginLeft: 4 },
              ]}
            >
              Flash Deals
            </Text>
            <View style={[styles.livePill, { backgroundColor: colors.errorContainer }]}>
              <Text style={[Typography.labelSm, { color: colors.onError, fontSize: 10 }]}>LIVE</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('product_list', { isFlashDeal: true, title: 'Flash Deals' })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[Typography.labelMd, { color: colors.primary }]}>See All</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsScroll}
        >
          {flashDeals.map((item) => (
            <FlashDealCard
              key={item.id}
              product={item}
              onPress={() => navigate('product_detail', { productId: item.id })}
              onAddToCart={() => addToCart(item, 1)}
              onToggleWishlist={() => toggleFavorite(item)}
              isFav={isFavorite(item.id)}
              inCart={isInCart(item.id)}
            />
          ))}
        </ScrollView>

        {/* Flagship Silicon Recommendations */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
            Recommended Hardware
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('product_list', { title: 'All Products' })}
          >
            <Text style={[Typography.labelMd, { color: colors.primary }]}>Explore All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {filteredRecommended.map((product) => (
            <ProductGridCard
              key={product.id}
              product={product}
              onPress={() => navigate('product_detail', { productId: product.id })}
              onAddToCart={() => addToCart(product, 1)}
              onToggleWishlist={() => toggleFavorite(product)}
              isFav={isFavorite(product.id)}
              inCart={isInCart(product.id)}
            />
          ))}
        </View>

        {/* Admin Quick Switcher Banner */}
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigate('admin_dashboard')}
            style={[styles.adminBanner, { backgroundColor: colors.secondaryContainer }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="speedometer-outline" size={24} color={colors.onSecondary} />
              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.onSecondary, fontWeight: '700' }]}>
                  Store Admin Portal
                </Text>
                <Text style={[Typography.bodySm, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                  Manage orders, inventory & sales analytics
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward-circle" size={28} color={colors.onSecondary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// Flash Deal Card Component matching Stitch design
const FlashDealCard: React.FC<{
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isFav: boolean;
  inCart: boolean;
}> = ({ product, onPress, onAddToCart, onToggleWishlist, isFav, inCart }) => {
  const { colors } = useTheme();

  return (
    <VoltCard variant="glass" style={styles.dealCard}>
      <View style={styles.dealBadgeRow}>
        <VoltBadge label="Lightning Deal" variant="violet" size="sm" />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleWishlist}
          style={[styles.heartButton, { backgroundColor: 'rgba(34, 42, 61, 0.8)' }]}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={16}
            color={isFav ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.dealImageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.dealImage} resizeMode="contain" />
      </TouchableOpacity>

      <View style={{ marginTop: Spacing.xs }}>
        <VoltRating rating={product.rating} reviewCount={product.reviewCount} />

        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <Text
            numberOfLines={1}
            style={[Typography.headlineSm, { color: colors.textPrimary, marginVertical: 4 }]}
          >
            {product.name}
          </Text>
        </TouchableOpacity>

        <VoltPrice price={product.price} originalPrice={product.originalPrice} size="card" />

        {/* Progress Bar */}
        <View style={[styles.progressTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${product.soldPercentage || 70}%`, backgroundColor: colors.error },
            ]}
          />
        </View>

        <View style={styles.stockRow}>
          <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>
            Sold: {product.soldPercentage || 70}%
          </Text>
          <Text style={[Typography.labelSm, { color: colors.error }]}>
            Only {product.stockCount} left
          </Text>
        </View>

        <VoltButton
          title={inCart ? 'In Cart' : 'Add to Cart'}
          size="sm"
          variant={inCart ? 'outline' : 'primary'}
          icon={<Ionicons name={inCart ? 'checkmark' : 'cart-outline'} size={15} color={inCart ? colors.primary : colors.onPrimaryContainer} />}
          onPress={onAddToCart}
          style={{ marginTop: Spacing.sm }}
        />
      </View>
    </VoltCard>
  );
};

// Recommended Grid Card
const ProductGridCard: React.FC<{
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isFav: boolean;
  inCart: boolean;
}> = ({ product, onPress, onAddToCart, onToggleWishlist, isFav, inCart }) => {
  const { colors } = useTheme();

  return (
    <VoltCard variant="glass" style={styles.gridCard}>
      <View style={styles.gridCardTop}>
        {product.isFlashDeal ? (
          <VoltBadge label="Flash Deal" variant="error" size="sm" />
        ) : (
          <VoltBadge label={product.brand} variant="cyan" size="sm" />
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleWishlist}
          style={[styles.heartButtonSmall, { backgroundColor: 'rgba(34, 42, 61, 0.8)' }]}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={15}
            color={isFav ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.gridImageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.gridImage} resizeMode="contain" />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <VoltRating rating={product.rating} reviewCount={product.reviewCount} />
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <Text
              numberOfLines={2}
              style={[Typography.labelLg, { color: colors.textPrimary, marginVertical: 4 }]}
            >
              {product.name}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <VoltPrice price={product.price} originalPrice={product.originalPrice} size="sm" />

          <VoltButton
            title={inCart ? 'Added' : 'Add'}
            size="sm"
            variant={inCart ? 'outline' : 'primary'}
            onPress={onAddToCart}
            style={{ marginTop: Spacing.sm, height: 34 }}
          />
        </View>
      </View>
    </VoltCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Roundness.full,
    borderWidth: 1,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  searchTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Roundness.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  searchFilterIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBadgesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  valueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Roundness.sm,
  },
  heroBanner: {
    borderRadius: Roundness.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(76, 215, 246, 0.12)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cyberWeekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Roundness.full,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Roundness.full,
  },
  heroMainGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 120,
  },
  carouselDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  dotActive: {
    width: 20,
    height: 5,
    borderRadius: 2.5,
  },
  dotInactive: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 68,
  },
  categoryIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePill: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dealsScroll: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  dealCard: {
    width: DEAL_CARD_WIDTH,
    padding: Spacing.md,
  },
  dealBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealImageContainer: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  progressTrack: {
    height: 5,
    borderRadius: 2.5,
    width: '100%',
    marginVertical: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  gridCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartButtonSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImageContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  adminBanner: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Roundness.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
