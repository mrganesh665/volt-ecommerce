import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltInput } from '../../components/common/VoltInput';
import { VoltCard } from '../../components/common/VoltCard';

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    const res = await login({ emailOrPhone, password });
    setLoading(false);

    if (res.success) {
      navigate('home');
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const autofillDemo = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setEmailOrPhone('rahul@volttech.io');
      setPassword('password123');
    } else {
      setEmailOrPhone('admin@volttech.io');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.boltIcon, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="flash" size={28} color={colors.onPrimaryContainer} />
          </View>
          <Text style={[Typography.displayLg, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
            VoltTech
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
            ]}
          >
            Sign in to access your tech orders, saved hardware & VIP pricing
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorContainer }]}>
            <Ionicons name="alert-circle" size={18} color={colors.onError} />
            <Text style={[Typography.bodySm, { color: colors.onError, marginLeft: Spacing.xs, flex: 1 }]}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Login Form */}
        <VoltCard variant="glass" style={styles.formCard}>
          <VoltInput
            label="Email or Mobile Number"
            placeholder="e.g. rahul@volttech.io"
            value={emailOrPhone}
            onChangeText={(t) => {
              setEmailOrPhone(t);
              if (error) setError('');
            }}
            leftIcon="person-outline"
            autoCapitalize="none"
          />

          <VoltInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (error) setError('');
            }}
            leftIcon="lock-closed-outline"
            isPassword
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('forgot_password')}>
              <Text style={[Typography.labelMd, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <VoltButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: Spacing.xs }}
          />

          {/* Quick Demo Credentials */}
          <View style={styles.demoSection}>
            <Text style={[Typography.labelSm, { color: colors.textTertiary, textAlign: 'center', marginBottom: Spacing.sm }]}>
              ONE-TAP DEMO LOGINS
            </Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => autofillDemo('customer')}
                style={[styles.demoPill, { backgroundColor: colors.surfaceContainerHigh }]}
              >
                <Ionicons name="person" size={14} color={colors.primary} />
                <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 4 }]}>
                  Customer VIP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => autofillDemo('admin')}
                style={[styles.demoPill, { backgroundColor: colors.surfaceContainerHigh }]}
              >
                <Ionicons name="shield-checkmark" size={14} color={colors.secondary} />
                <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 4 }]}>
                  Store Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.registerPrompt}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('register')}>
              <Text style={[Typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </VoltCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 36,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  boltIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Roundness.md,
    marginBottom: Spacing.md,
  },
  formCard: {
    padding: Spacing.lg,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  demoSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Roundness.full,
  },
  registerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
});
