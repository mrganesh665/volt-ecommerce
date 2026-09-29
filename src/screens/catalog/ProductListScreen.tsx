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
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltPrice } from '../../components/common/VoltPrice';
import { VoltRating } from '../../components/common/VoltRating';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltCard } from '../../components/common/VoltCard';

const { width } = Dimensions.get('window');

export const ProductListScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute, navigate } = useNavigation();
  const { products } = useCatalog();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useWishlist();

  const params = currentRoute.params || {};
  const screenTitle = params.title || 'All Hardware';
  const categoryId = params.categoryId;
  const isFlashDeal = params.isFlashDeal;
  const subQuery = params.query?.toLowerCase();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating'>('popularity');

  let list = [...products];

  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId);
  }
  if (isFlashDeal) {
    list = list.filter((p) => p.isFlashDeal);
  }
  if (subQuery) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(subQuery) ||
        p.tagline.toLowerCase().includes(subQuery) ||
        p.description.toLowerCase().includes(subQuery)
    );
  }

  if (sortBy === 'price_low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else {
    list.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={screenTitle}
        showLogo={false}
        showDelivery={false}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={[styles.viewToggleBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
              size={18}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sort Bar */}
        <View style={styles.sortBar}>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {list.length} hardware products
          </Text>

          <View style={styles.sortPills}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSortBy('popularity')}
              style={[
                styles.sortChip,
                {
                  backgroundColor: sortBy === 'popularity' ? colors.primary : colors.surfaceContainer,
                },
              ]}
            >
              <Text
                style={[
                  Typography.labelSm,
                  { color: sortBy === 'popularity' ? colors.onPrimary : colors.textSecondary },
                ]}
              >
                Top Rated
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSortBy(sortBy === 'price_low' ? 'price_high' : 'price_low')}
              style={[
                styles.sortChip,
                {
                  backgroundColor:
                    sortBy === 'price_low' || sortBy === 'price_high'
                      ? colors.primary
                      : colors.surfaceContainer,
                },
              ]}
            >
              <Text
                style={[
                  Typography.labelSm,
                  {
                    color:
                      sortBy === 'price_low' || sortBy === 'price_high'
                        ? colors.onPrimary
                        : colors.textSecondary,
                  },
                ]}
              >
                Price {sortBy === 'price_low' ? '↑' : sortBy === 'price_high' ? '↓' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Representation */}
        {viewMode === 'grid' ? (
          <View style={styles.gridContainer}>
            {list.map((item) => {
              const inCart = isInCart(item.id);
              const isFav = isFavorite(item.id);

              return (
                <VoltCard key={item.id} variant="glass" style={styles.gridItem}>
                  <View style={styles.cardHeader}>
                    {item.isFlashDeal ? (
                      <VoltBadge label="Flash Deal" variant="error" size="sm" />
                    ) : (
                      <VoltBadge label={item.brand} variant="cyan" size="sm" />
                    )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleFavorite(item)}
                      style={[styles.favBtn, { backgroundColor: 'rgba(34, 42, 61, 0.8)' }]}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={15}
                        color={isFav ? colors.error : colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigate('product_detail', { productId: item.id })}
                    style={styles.gridImgBox}
                  >
                    <Image source={{ uri: item.images[0] }} style={styles.gridImg} resizeMode="contain" />
                  </TouchableOpacity>

                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                      <VoltRating rating={item.rating} reviewCount={item.reviewCount} />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigate('product_detail', { productId: item.id })}
                      >
                        <Text
                          numberOfLines={2}
                          style={[Typography.labelLg, { color: colors.textPrimary, marginVertical: 4 }]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <VoltPrice price={item.price} originalPrice={item.originalPrice} size="sm" />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => addToCart(item, 1)}
                        style={[
                          styles.addBtn,
                          {
                            backgroundColor: inCart ? 'transparent' : colors.primaryContainer,
                            borderColor: colors.primary,
                            borderWidth: inCart ? 1 : 0,
                          },
                        ]}
                      >
                        <Ionicons
                          name={inCart ? 'checkmark' : 'cart-outline'}
                          size={14}
                          color={inCart ? colors.primary : colors.onPrimaryContainer}
                        />
                        <Text
                          style={[
                            Typography.labelSm,
                            {
                              color: inCart ? colors.primary : colors.onPrimaryContainer,
                              marginLeft: 4,
                              fontWeight: '700',
                            },
                          ]}
                        >
                          {inCart ? 'Added' : 'Add to Cart'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </VoltCard>
              );
            })}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {list.map((item) => {
              const inCart = isInCart(item.id);
              const isFav = isFavorite(item.id);

              return (
                <VoltCard
                  key={item.id}
                  variant="glass"
                  style={styles.listItem}
                  onPress={() => navigate('product_detail', { productId: item.id })}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.listImg} resizeMode="contain" />
                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <VoltBadge label={item.brand} variant="cyan" size="sm" />
                      <TouchableOpacity activeOpacity={0.7} onPress={() => toggleFavorite(item)}>
                        <Ionicons
                          name={isFav ? 'heart' : 'heart-outline'}
                          size={18}
                          color={isFav ? colors.error : colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        Typography.labelLg,
                        { color: colors.textPrimary, fontWeight: '700', marginTop: 4 },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[Typography.bodySm, { color: colors.textSecondary, marginVertical: 2 }]}
                    >
                      {item.tagline}
                    </Text>
                    <VoltRating rating={item.rating} reviewCount={item.reviewCount} />
                    <View style={styles.listBottomRow}>
                      <VoltPrice price={item.price} originalPrice={item.originalPrice} size="sm" />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => addToCart(item, 1)}
                        style={[
                          styles.listAddBtn,
                          {
                            backgroundColor: inCart ? 'transparent' : colors.primaryContainer,
                            borderColor: colors.primary,
                            borderWidth: inCart ? 1 : 0,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            Typography.labelSm,
                            { color: inCart ? colors.primary : colors.onPrimaryContainer, fontWeight: '700' },
                          ]}
                        >
                          {inCart ? 'In Cart' : 'Add'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </VoltCard>
              );
            })}
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  viewToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sortPills: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  gridItem: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImgBox: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  gridImg: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: Roundness.sm,
    marginTop: Spacing.xs,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  listImg: {
    width: 90,
    height: 90,
  },
  listBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  listAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Roundness.sm,
  },
});
