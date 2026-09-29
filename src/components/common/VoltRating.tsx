import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing } from '../../theme';

interface VoltRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export const VoltRating: React.FC<VoltRatingProps> = ({
  rating,
  reviewCount,
  size = 'sm',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surfaceContainerHigh,
            paddingHorizontal: size === 'sm' ? 6 : 8,
            paddingVertical: size === 'sm' ? 2 : 4,
          },
        ]}
      >
        <Ionicons name="star" size={size === 'sm' ? 12 : 14} color={colors.gold} />
        <Text
          style={[
            Typography.labelSm,
            {
              color: colors.textPrimary,
              fontWeight: '700',
              marginLeft: 4,
            },
          ]}
        >
          {rating.toFixed(1)}
        </Text>
      </View>

      {typeof reviewCount === 'number' && (
        <Text
          style={[
            Typography.bodySm,
            {
              color: colors.textSecondary,
              marginLeft: Spacing.xs,
            },
          ]}
        >
          ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
});
