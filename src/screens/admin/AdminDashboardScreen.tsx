import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { orderService } from '../../services/order.service';
import { AdminStats } from '../../types';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';

export const AdminDashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="Store Admin Portal" showLogo={false} showDelivery={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Admin Welcome */}
        <View style={styles.topBanner}>
          <Text style={[Typography.labelMd, { color: colors.secondaryLight }]}>VOLTTECH OPERATIONS</Text>
          <Text style={[Typography.headlineLg, { color: colors.textPrimary, fontWeight: '800' }]}>
            Commercial Overview
          </Text>
        </View>

        {/* 4 Primary KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          {/* Gross Revenue */}
          <VoltCard variant="elevated" style={styles.kpiCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>GROSS SALES</Text>
              <Ionicons name="trending-up" size={16} color={colors.tertiary} />
            </View>
            <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 22, marginVertical: 4 }]}>
              ₹{stats ? stats.grossRevenue.toLocaleString('en-IN') : '...'}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.tertiary, fontSize: 11 }]}>
              +18.4% vs last week
            </Text>
          </VoltCard>

          {/* Total Orders */}
          <VoltCard
            variant="elevated"
            style={styles.kpiCard}
            onPress={() => navigate('admin_orders')}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>ORDERS</Text>
              <Ionicons name="cube-outline" size={16} color={colors.secondary} />
            </View>
            <Text style={[Typography.priceCard, { color: colors.textPrimary, fontSize: 22, marginVertical: 4 }]}>
              {stats ? stats.totalOrders : '...'}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.primary, fontSize: 11 }]}>
              {stats?.pendingShipments || 0} pending dispatch
            </Text>
          </VoltCard>

          {/* Active Products */}
          <VoltCard
            variant="elevated"
            style={styles.kpiCard}
            onPress={() => navigate('admin_products')}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>CATALOG</Text>
              <Ionicons name="hardware-chip-outline" size={16} color={colors.primary} />
            </View>
            <Text style={[Typography.priceCard, { color: colors.textPrimary, fontSize: 22, marginVertical: 4 }]}>
              {stats ? stats.activeProducts : '...'}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, fontSize: 11 }]}>
              Active hardware items
            </Text>
          </VoltCard>

          {/* Average Order Value */}
          <VoltCard variant="elevated" style={styles.kpiCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>AVG ORDER VALUE</Text>
              <Ionicons name="card-outline" size={16} color={colors.tertiary} />
            </View>
            <Text style={[Typography.priceCard, { color: colors.tertiary, fontSize: 20, marginVertical: 4 }]}>
              ₹{stats ? stats.averageOrderValue.toLocaleString('en-IN') : '...'}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, fontSize: 11 }]}>
              VIP tier average
            </Text>
          </VoltCard>
        </View>

        {/* Weekly Revenue Visualizer */}
        <VoltCard variant="glass" style={styles.chartCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
              7-Day Sales Volume
            </Text>
            <VoltBadge label="LIVE REVENUE" variant="cyan" size="sm" />
          </View>

          <View style={styles.barsContainer}>
            {stats?.weeklyRevenue.map((d, i) => {
              const maxVal = Math.max(...stats.weeklyRevenue.map((x) => x.amount), 1);
              const heightPercent = Math.max(20, Math.round((d.amount / maxVal) * 100));

              return (
                <View key={i} style={styles.barColumn}>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceContainerLow }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: i === stats.weeklyRevenue.length - 1 ? colors.primary : colors.surfaceContainerHighest,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[Typography.labelSm, { color: colors.textTertiary, marginTop: 6 }]}>
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </VoltCard>

        {/* Quick Management Actions */}
        <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
          Inventory & Logistics Operations
        </Text>

        <View style={styles.actionsList}>
          <VoltCard
            variant="glass"
            style={styles.actionCard}
            onPress={() => navigate('admin_products')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="pricetags-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Hardware Inventory Manager
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                Update stock levels, edit prices, specifications & images
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </VoltCard>

          <VoltCard
            variant="glass"
            style={styles.actionCard}
            onPress={() => navigate('admin_product_edit')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="add-circle-outline" size={22} color={colors.tertiary} />
            </View>
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Add New Hardware Item
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                Publish new laptop, acoustic, or wearable to catalog
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </VoltCard>

          <VoltCard
            variant="glass"
            style={styles.actionCard}
            onPress={() => navigate('admin_orders')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="airplane-outline" size={22} color={colors.secondary} />
            </View>
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                Air Express Order Dispatch Hub
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                Advance orders to Shipped, Out for Delivery, or Delivered
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </VoltCard>
        </View>
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
  topBanner: {
    marginBottom: Spacing.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    width: '48.5%',
    padding: Spacing.md,
  },
  chartCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: Spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 20,
    height: 90,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  actionsList: {
    gap: Spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
