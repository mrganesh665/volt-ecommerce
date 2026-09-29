import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme, Roundness, Spacing } from '../../theme';

interface VoltCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'glass' | 'outlined' | 'flat';
  onPress?: () => void;
  padded?: boolean;
}

export const VoltCard: React.FC<VoltCardProps> = ({
  children,
  style,
  variant = 'glass',
  onPress,
  padded = true,
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return colors.surfaceContainerHigh;
      case 'flat':
        return colors.surfaceContainerLow;
      case 'outlined':
        return colors.surfaceContainerLowest;
      case 'glass':
      default:
        return colors.surfaceContainer;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: Roundness.lg,
    padding: padded ? Spacing.md : 0,
    borderColor: variant === 'outlined' ? colors.outlineVariant : colors.divider,
    borderWidth: 1,
    overflow: 'hidden',
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
