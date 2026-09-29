import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Typography, Spacing } from '../../theme';

interface VoltPriceProps {
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  size?: 'card' | 'hero' | 'sm';
  showDiscountBadge?: boolean;
}

export const VoltPrice: React.FC<VoltPriceProps> = ({
  price,
  originalPrice,
  discountPercentage,
  size = 'card',
  showDiscountBadge = true,
}) => {
  const { colors, formatPrice } = useTheme();

  const getPriceStyle = () => {
    switch (size) {
      case 'hero':
        return [Typography.priceHero, { fontSize: 26, color: colors.primary }];
      case 'sm':
        return [Typography.labelLg, { fontWeight: '700' as const, color: colors.primary }];
      case 'card':
      default:
        return [Typography.priceCard, { color: colors.primary }];
    }
  };

  const calcDiscount =
    discountPercentage ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  return (
    <View style={styles.container}>
      <Text style={getPriceStyle()}>{formatPrice(price)}</Text>

      {originalPrice && originalPrice > price && (
        <Text
          style={[
            Typography.bodySm,
            {
              color: colors.textTertiary,
              textDecorationLine: 'line-through',
              marginLeft: Spacing.xs,
            },
          ]}
        >
          {formatPrice(originalPrice)}
        </Text>
      )}

      {showDiscountBadge && calcDiscount > 0 && (
        <View style={[styles.discountTag, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
          <Text style={[Typography.labelSm, { color: colors.tertiary, fontWeight: '700' }]}>
            {calcDiscount}% OFF
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  discountTag: {
    marginLeft: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
