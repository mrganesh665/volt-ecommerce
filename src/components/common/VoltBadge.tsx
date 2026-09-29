import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Roundness, Typography, Spacing } from '../../theme';

interface VoltBadgeProps {
  label: string;
  variant?: 'cyan' | 'violet' | 'emerald' | 'error' | 'slate' | 'gold';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const VoltBadge: React.FC<VoltBadgeProps> = ({
  label,
  variant = 'cyan',
  size = 'sm',
  style,
}) => {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'violet':
        return { bg: colors.secondaryContainer, text: colors.secondaryLight };
      case 'emerald':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: colors.tertiary };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.18)', text: colors.error };
      case 'gold':
        return { bg: 'rgba(251, 191, 36, 0.18)', text: colors.gold };
      case 'slate':
        return { bg: colors.surfaceContainerHigh, text: colors.textSecondary };
      case 'cyan':
      default:
        return { bg: 'rgba(6, 182, 212, 0.18)', text: colors.primary };
    }
  };

  const scheme = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 8,
          borderRadius: Roundness.xs,
        },
        style,
      ]}
    >
      <Text
        style={[
          isSm ? Typography.labelSm : Typography.labelMd,
          {
            color: scheme.text,
            fontWeight: '700',
            textTransform: 'uppercase',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
