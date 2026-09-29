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

export const ForgotPasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const { forgotPassword } = useAuth();
  const { navigate, goBack } = useNavigation();

  const [step, setStep] = useState<1 | 2>(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setError('');
    setMessage('');
    if (!emailOrPhone.trim()) {
      setError('Please provide your registered email or phone');
      return;
    }
    setLoading(true);
    const res = await forgotPassword(emailOrPhone);
    setLoading(false);

    if (res.success) {
      setStep(2);
      setMessage(`Verification OTP sent to ${emailOrPhone}. Use test code: 123456`);
    } else {
      setError(res.message || 'No registered user matches this detail');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(emailOrPhone, newPassword);
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
      setTimeout(() => {
        navigate('login');
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goBack()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Ionicons name="key-outline" size={28} color={colors.primary} />
          </View>

          <Text style={[Typography.displayLg, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
            Reset Password
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
            ]}
          >
            {step === 1
              ? 'Enter your registered email or phone to receive a recovery code'
              : 'Enter the verification code and choose your new password'}
          </Text>
        </View>

        {error ? (
          <View style={[styles.banner, { backgroundColor: colors.errorContainer }]}>
            <Ionicons name="alert-circle" size={18} color={colors.onError} />
            <Text style={[Typography.bodySm, { color: colors.onError, marginLeft: Spacing.xs, flex: 1 }]}>
              {error}
            </Text>
          </View>
        ) : null}

        {message ? (
          <View style={[styles.banner, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.tertiary} />
            <Text style={[Typography.bodySm, { color: colors.tertiary, marginLeft: Spacing.xs, flex: 1 }]}>
              {message}
            </Text>
          </View>
        ) : null}

        <VoltCard variant="glass" style={styles.formCard}>
          {step === 1 ? (
            <>
              <VoltInput
                label="Registered Email or Mobile Phone"
                placeholder="e.g. rahul@volttech.io"
                value={emailOrPhone}
                onChangeText={(t) => {
                  setEmailOrPhone(t);
                  if (error) setError('');
                }}
                leftIcon="mail-outline"
                autoCapitalize="none"
              />

              <VoltButton
                title="Send Recovery OTP"
                onPress={handleSendCode}
                loading={loading}
                style={{ marginTop: Spacing.sm }}
              />
            </>
          ) : (
            <>
              <VoltInput
                label="Verification Code (OTP)"
                placeholder="Enter 6-digit code (e.g. 123456)"
                value={otp}
                onChangeText={setOtp}
                leftIcon="shield-checkmark-outline"
                keyboardType="number-pad"
              />

              <VoltInput
                label="New Password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChangeText={setNewPassword}
                leftIcon="lock-closed-outline"
                isPassword
              />

              <VoltInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon="lock-closed-outline"
                isPassword
              />

              <VoltButton
                title="Save & Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                style={{ marginTop: Spacing.sm }}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setStep(1)}
                style={{ alignItems: 'center', marginTop: Spacing.md }}
              >
                <Text style={[Typography.labelMd, { color: colors.textSecondary }]}>
                  Change Email / Phone
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('login')}
            style={styles.backToLogin}
          >
            <Ionicons name="arrow-back" size={16} color={colors.primary} />
            <Text style={[Typography.labelLg, { color: colors.primary, marginLeft: 4 }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
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
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Roundness.md,
    marginBottom: Spacing.md,
  },
  formCard: {
    padding: Spacing.lg,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
});
