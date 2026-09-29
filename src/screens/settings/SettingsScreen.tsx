import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';

export const SettingsScreen: React.FC = () => {
  const { isDark, toggleTheme, currency, setCurrency, colors } = useTheme();
  const { goBack } = useNavigation();
  const { resetCatalog } = useCatalog();

  const [orderNotifs, setOrderNotifs] = useState(true);
  const [dealNotifs, setDealNotifs] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleResetCatalog = () => {
    Alert.alert(
      'Reset Demo Hardware Data',
      'This will restore all default products, categories, coupons, and orders.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetCatalog();
            Alert.alert('Done', 'VoltTech catalog has been restored to default.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="Settings & Preferences" showLogo={false} showDelivery={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
          APPEARANCE & DISPLAY
        </Text>
        <VoltCard variant="glass" style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
              <View style={{ marginLeft: Spacing.md }}>
                <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {isDark ? 'VoltTech Obsidian Dark' : 'Clean Light Mode'}
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  {isDark ? 'High-contrast dark OLED theme' : 'Crisp day theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>
        </VoltCard>

        {/* Currency Section */}
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md }]}>
          PRICING CURRENCY
        </Text>
        <VoltCard variant="glass" style={styles.card}>
          {[
            { code: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
            { code: 'USD', label: 'US Dollar ($)', symbol: '$' },
            { code: 'EUR', label: 'Euro (€)', symbol: '€' },
          ].map((c, idx, arr) => {
            const isSelected = currency === c.code;

            return (
              <TouchableOpacity
                key={c.code}
                activeOpacity={0.7}
                onPress={() => setCurrency(c.code as any)}
                style={[
                  styles.currencyRow,
                  { borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.divider },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Typography.headlineSm, { color: colors.primary, width: 28 }]}>
                    {c.symbol}
                  </Text>
                  <Text style={[Typography.bodyMd, { color: colors.textPrimary, marginLeft: Spacing.sm }]}>
                    {c.label}
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </VoltCard>

        {/* Push Notifications Section */}
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md }]}>
          NOTIFICATIONS
        </Text>
        <VoltCard variant="glass" style={styles.card}>
          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: Spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Air Express Order Updates
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                Live tracking alerts when dispatched or out for delivery
              </Text>
            </View>
            <Switch
              value={orderNotifs}
              onValueChange={setOrderNotifs}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>

          <View style={[styles.settingRow, { paddingTop: Spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Flash Deals & Price Drops
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                Exclusive notifications for Cyber Week and VIP deals
              </Text>
            </View>
            <Switch
              value={dealNotifs}
              onValueChange={setDealNotifs}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>
        </VoltCard>

        {/* Security Section */}
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md }]}>
          SECURITY
        </Text>
        <VoltCard variant="glass" style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Biometric App Lock
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                Require FaceID or Fingerprint before checkout & profile access
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>
        </VoltCard>

        {/* System & Cache */}
        <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md }]}>
          SYSTEM & DATA
        </Text>
        <VoltCard variant="glass" style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClearCache}
            style={[styles.actionRow, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
          >
            <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>Clear Cached Imagery</Text>
            <Text style={[Typography.labelSm, { color: cacheCleared ? colors.tertiary : colors.textTertiary }]}>
              {cacheCleared ? 'Cache Cleared!' : '14.2 MB'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleResetCatalog} style={styles.actionRow}>
            <Text style={[Typography.bodyMd, { color: colors.error }]}>Reset Demo Catalog Data</Text>
            <Ionicons name="refresh" size={18} color={colors.error} />
          </TouchableOpacity>
        </VoltCard>
      </ScrollView>
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
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});
