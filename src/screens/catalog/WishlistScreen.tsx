import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltPrice } from '../../components/common/VoltPrice';
import { VoltRating } from '../../components/common/VoltRating';
import { VoltButton } from '../../components/common/VoltButton';

export const WishlistScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { favorites, toggleFavorite, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={`Saved Hardware (${favorites.length})`}
        showLogo={false}
        showDelivery={false}
        rightAction={
          favorites.length > 0 ? (
            <TouchableOpacity activeOpacity={0.7} onPress={clearWishlist}>
              <Text style={[Typography.labelMd, { color: colors.error }]}>Clear</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {favorites.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {favorites.map((product) => {
              const inCart = isInCart(product.id);

              return (
                <VoltCard
                  key={product.id}
                  variant="glass"
                  style={styles.card}
                  onPress={() => navigate('product_detail', { productId: product.id })}
                >
                  <Image source={{ uri: product.images[0] }} style={styles.image} resizeMode="contain" />

                  <View style={styles.infoCol}>
                    <View style={styles.topRow}>
                      <Text style={[Typography.labelSm, { color: colors.primary, textTransform: 'uppercase' }]}>
                        {product.brand}
                      </Text>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => toggleFavorite(product)}>
                        <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={[Typography.headlineSm, { color: colors.textPrimary, marginVertical: 2 }]}
                    >
                      {product.name}
                    </Text>

                    <VoltRating rating={product.rating} reviewCount={product.reviewCount} />

                    <View style={styles.bottomRow}>
                      <VoltPrice price={product.price} originalPrice={product.originalPrice} size="sm" />


                    </View>
                    <VoltButton
                      title={inCart ? 'In Cart' : 'Move to Cart'}
                      size="sm"
                      variant={inCart ? 'outline' : 'primary'}
                      fullWidth={false}
                      icon={<Ionicons name="cart-outline" size={14} color={inCart ? colors.primary : colors.onPrimaryContainer} />}
                      onPress={() => addToCart(product, 1)}
                    />
                  </View>
                </VoltCard>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceContainer }]}>
            <Ionicons name="heart-outline" size={40} color={colors.textTertiary} />
          </View>
          <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
            Your Wishlist is Empty
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
            ]}
          >
            Save your favorite flagship silicon laptops, acoustics, and wearables to track price drops.
          </Text>
          <VoltButton
            title="Discover Tech Deals"
            onPress={() => navigate('home')}
            style={{ marginTop: Spacing.lg, width: 220 }}
          />
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
    paddingBottom: 40,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  image: {

    width: 84,
    height: 84,
  },
  infoCol: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
