import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { VoltPrice } from '../../components/common/VoltPrice';
import { VoltRating } from '../../components/common/VoltRating';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltCard } from '../../components/common/VoltCard';
import { Product } from '../../types';

const { width } = Dimensions.get('window');

export const SearchScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate, goBack } = useNavigation();
  const { products, categories } = useCatalog();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useWishlist();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating'>('popularity');
  const [filtered, setFiltered] = useState<Product[]>(products);

  const recentSearches = ['MacBook Pro M3', 'ANC Headphones', 'Titanium Smartwatch', 'RTX 4080'];

  useEffect(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
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

    setFiltered(list);
  }, [query, selectedCategory, sortBy, products]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Search Input */}
      <View
        style={[
          styles.searchHeader,
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

        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.divider,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.primary} />
          <TextInput
            placeholder="Search products, brands, chips..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            style={[styles.input, Typography.bodyMd, { color: colors.textPrimary }]}
          />
          {query.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Recent Searches Pills (when query is empty) */}
        {!query && (
          <View style={styles.recentSection}>
            <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
              Trending Searches
            </Text>
            <View style={styles.recentPills}>
              {recentSearches.map((term) => (
                <TouchableOpacity
                  key={term}
                  activeOpacity={0.7}
                  onPress={() => setQuery(term)}
                  style={[styles.recentPill, { backgroundColor: colors.surfaceContainerLow }]}
                >
                  <Ionicons name="trending-up" size={13} color={colors.primary} />
                  <Text style={[Typography.bodySm, { color: colors.textPrimary, marginLeft: 4 }]}>
                    {term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedCategory === 'all' ? colors.primaryContainer : colors.surfaceContainer,
              },
            ]}
          >
            <Text
              style={[
                Typography.labelSm,
                {
                  color: selectedCategory === 'all' ? colors.onPrimaryContainer : colors.textSecondary,
                  fontWeight: selectedCategory === 'all' ? '700' : '500',
                },
              ]}
            >
              All Categories
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSel ? colors.primaryContainer : colors.surfaceContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.labelSm,
                    {
                      color: isSel ? colors.onPrimaryContainer : colors.textSecondary,
                      fontWeight: isSel ? '700' : '500',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort & Results Bar */}
        <View style={styles.sortRow}>
          <Text style={[Typography.labelMd, { color: colors.textSecondary }]}>
            {filtered.length} {filtered.length === 1 ? 'item found' : 'items found'}
          </Text>

          <View style={styles.sortPills}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSortBy('popularity')}
              style={[
                styles.sortPill,
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
                Popular
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSortBy(sortBy === 'price_low' ? 'price_high' : 'price_low')}
              style={[
                styles.sortPill,
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

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSortBy('rating')}
              style={[
                styles.sortPill,
                {
                  backgroundColor: sortBy === 'rating' ? colors.primary : colors.surfaceContainer,
                },
              ]}
            >
              <Text
                style={[
                  Typography.labelSm,
                  { color: sortBy === 'rating' ? colors.onPrimary : colors.textSecondary },
                ]}
              >
                Rating
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <View style={styles.resultsGrid}>
            {filtered.map((item) => {
              const inCart = isInCart(item.id);
              const isFav = isFavorite(item.id);

              return (
                <VoltCard key={item.id} variant="glass" style={styles.itemCard}>
                  <View style={styles.itemCardTop}>
                    <VoltBadge label={item.categoryName} variant="cyan" size="sm" />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleFavorite(item)}
                      style={[styles.heartBtn, { backgroundColor: 'rgba(34, 42, 61, 0.8)' }]}
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
                    style={styles.imageBox}
                  >
                    <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="contain" />
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
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="search-outline" size={36} color={colors.textTertiary} />
            </View>
            <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              No Tech Hardware Found
            </Text>
            <Text
              style={[
                Typography.bodyMd,
                { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
              ]}
            >
              We couldn't find matches for "{query}". Try checking for spelling or explore other
              categories.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              style={[styles.clearBtn, { backgroundColor: colors.surfaceContainerHigh }]}
            >
              <Text style={[Typography.labelMd, { color: colors.primary }]}>Clear All Filters</Text>
            </TouchableOpacity>
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: Roundness.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: Spacing.xs,
    padding: 0,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  recentSection: {
    marginBottom: Spacing.md,
  },
  recentPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.full,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Roundness.full,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sortPills: {
    flexDirection: 'row',
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  itemCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  itemCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  image: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Roundness.md,
  },
});
