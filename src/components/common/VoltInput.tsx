import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Roundness, Typography, Spacing } from '../../theme';

interface VoltInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const VoltInput: React.FC<VoltInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  isPassword = false,
  containerStyle,
  style,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.outlineVariant;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderColor,
            borderWidth: isFocused || error ? 1.5 : 1,
            borderRadius: Roundness.md,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? colors.primary : colors.textTertiary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            Typography.bodyMd,
            {
              color: colors.textPrimary,
            },
            style,
          ]}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={[Typography.bodySm, { color: colors.error, marginTop: Spacing.xs }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: Spacing.xs }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  rightIcon: {
    padding: Spacing.xs,
  },
});
