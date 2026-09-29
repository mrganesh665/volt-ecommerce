import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme, Roundness, Typography, Spacing } from '../../theme';

interface VoltButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const VoltButton: React.FC<VoltButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceContainer;
    switch (variant) {
      case 'primary':
        return colors.primaryContainer;
      case 'secondary':
        return colors.secondaryContainer;
      case 'danger':
        return colors.errorContainer;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primaryContainer;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    switch (variant) {
      case 'primary':
        return colors.onPrimaryContainer;
      case 'secondary':
        return colors.onSecondary;
      case 'danger':
        return colors.onError;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textPrimary;
      default:
        return colors.onPrimaryContainer;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, height: 36 };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 20, height: 52 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, height: 46 };
    }
  };

  const padding = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: Roundness.md,
          width: fullWidth ? '100%' : 'auto',
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          ...padding,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              Typography.labelLg,
              {
                color: getTextColor(),
                fontWeight: '700',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
