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

export const RegisterScreen: React.FC = () => {
  const { colors } = useTheme();
  const { register } = useAuth();
  const { navigate, goBack } = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.terms = 'You must agree to the Terms of Service';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (res.success) {
      navigate('home');
    } else {
      setServerError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goBack()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.brandIconWrapper}>
            <View style={[styles.boltIcon, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="flash" size={24} color={colors.onPrimaryContainer} />
            </View>
          </View>

          <Text style={[Typography.displayLg, { color: colors.textPrimary, textAlign: 'center' }]}>
            Create Account
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
            ]}
          >
            Join VoltTech VIP for member-only tech deals & express delivery
          </Text>
        </View>

        {serverError ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorContainer }]}>
            <Ionicons name="alert-circle" size={18} color={colors.onError} />
            <Text style={[Typography.bodySm, { color: colors.onError, marginLeft: Spacing.xs, flex: 1 }]}>
              {serverError}
            </Text>
          </View>
        ) : null}

        {/* Registration Card */}
        <VoltCard variant="glass" style={styles.formCard}>
          {/* Name Field */}
          <VoltInput
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            leftIcon="person-outline"
            error={errors.name}
            autoCapitalize="words"
          />

          {/* Email Field */}
          <VoltInput
            label="Email Address"
            placeholder="e.g. rahul@example.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            leftIcon="mail-outline"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Field */}
          <VoltInput
            label="Mobile Phone"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            leftIcon="call-outline"
            error={errors.phone}
            keyboardType="phone-pad"
          />

          {/* Password Field */}
          <VoltInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            leftIcon="lock-closed-outline"
            isPassword
            error={errors.password}
          />

          {/* Confirm Password Field */}
          <VoltInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            leftIcon="shield-checkmark-outline"
            isPassword
            error={errors.confirmPassword}
          />

          {/* Terms Checkbox */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAgreeTerms(!agreeTerms)}
            style={styles.termsRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: errors.terms ? colors.error : agreeTerms ? colors.primary : colors.outline,
                  backgroundColor: agreeTerms ? colors.primary : 'transparent',
                },
              ]}
            >
              {agreeTerms && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
            </View>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, flex: 1 }]}>
              I agree to the <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
              <Text style={{ color: colors.primary }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms ? (
            <Text style={[Typography.bodySm, { color: colors.error, marginTop: -Spacing.xs, marginBottom: Spacing.sm }]}>
              {errors.terms}
            </Text>
          ) : null}

          <VoltButton
            title="Create VIP Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />

          <View style={styles.loginPrompt}>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('login')}>
              <Text style={[Typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
                Sign In
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
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
    width: '100%',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconWrapper: {
    marginBottom: Spacing.sm,
  },
  boltIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
});
