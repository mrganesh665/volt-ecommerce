import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAddress } from '../../context/AddressContext';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { user, isAdmin, logout, toggleAdminRole } = useAuth();
  const { orders } = useOrder();
  const { favorites } = useWishlist();
  const { addresses } = useAddress();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your VoltTech account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigate('login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <VoltCard variant="elevated" style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={[styles.avatar, { borderColor: colors.primary }]} />
            ) : (
              <View style={[styles.avatar, styles.fallbackAvatar, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="person" size={32} color={colors.primary} />
              </View>
            )}

            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.headlineMd, { color: colors.textPrimary, fontWeight: '800' }]}>
                  {user?.name || 'VoltTech Member'}
                </Text>
              </View>

              <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                {user?.email || 'member@volttech.io'}
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                {user?.phone || '+91 98765 43210'}
              </Text>

              <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs }}>
                <VoltBadge label="VOLT VIP" variant="emerald" size="sm" />
                {isAdmin && <VoltBadge label="ADMINISTRATOR" variant="violet" size="sm" />}
              </View>
            </View>
          </View>
        </VoltCard>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <VoltCard
            variant="glass"
            style={styles.statBox}
            onPress={() => navigate('order_history')}
          >
            <Text style={[Typography.priceCard, { color: colors.primary, fontSize: 20 }]}>
              {orders.length}
            </Text>
            <Text style={[Typography.labelSm, { color: colors.textSecondary, marginTop: 2 }]}>
              Orders
            </Text>
          </VoltCard>

          <VoltCard
            variant="glass"
            style={styles.statBox}
            onPress={() => navigate('wishlist')}
          >
            <Text style={[Typography.priceCard, { color: colors.secondary, fontSize: 20 }]}>
              {favorites.length}
            </Text>
            <Text style={[Typography.labelSm, { color: colors.textSecondary, marginTop: 2 }]}>
              Wishlist
            </Text>
          </VoltCard>

          <VoltCard
            variant="glass"
            style={styles.statBox}
            onPress={() => navigate('address_select')}
          >
            <Text style={[Typography.priceCard, { color: colors.tertiary, fontSize: 20 }]}>
              {addresses.length}
            </Text>
            <Text style={[Typography.labelSm, { color: colors.textSecondary, marginTop: 2 }]}>
              Addresses
            </Text>
          </VoltCard>
        </View>

        {/* Admin Role Toggle Banner */}
        <VoltCard
          variant="glass"
          style={[styles.adminToggleCard, { borderColor: isAdmin ? colors.secondary : colors.divider }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.toggleIconBox, { backgroundColor: isAdmin ? colors.secondaryContainer : colors.surfaceContainerHigh }]}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={isAdmin ? colors.secondaryLight : colors.textTertiary}
              />
            </View>
            <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
              <Text style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                {isAdmin ? 'Admin Mode (Active)' : 'Customer Mode (Active)'}
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary, fontSize: 11 }]}>
                {isAdmin ? 'Access product catalog editor & live order management' : 'Tap to switch to store admin privileges'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleAdminRole}
            style={[
              styles.switchBtn,
              { backgroundColor: isAdmin ? colors.secondaryContainer : colors.surfaceContainerHigh },
            ]}
          >
            <Text style={[Typography.labelSm, { color: isAdmin ? colors.onSecondary : colors.primary, fontWeight: '700' }]}>
              {isAdmin ? 'Switch to Customer' : 'Enable Admin'}
            </Text>
          </TouchableOpacity>
        </VoltCard>

        {/* Store Admin Portal Link (if admin) */}
        {isAdmin && (
          <VoltCard
            variant="elevated"
            style={[styles.adminPortalCard, { backgroundColor: colors.surfaceContainerHigh }]}
            onPress={() => navigate('admin_dashboard')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="speedometer" size={24} color={colors.secondary} />
              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Open Admin Dashboard
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Manage catalog products, live orders & revenue metrics
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </VoltCard>
        )}

        {/* Account Menu Items */}
        <VoltCard variant="glass" style={styles.menuCard}>
          {[
            {
              title: 'Order History & Shipments',
              icon: 'cube-outline',
              action: () => navigate('order_history'),
            },
            {
              title: 'Saved Delivery Addresses',
              icon: 'location-outline',
              action: () => navigate('address_select'),
            },
            {
              title: 'Saved Wishlist Hardware',
              icon: 'heart-outline',
              action: () => navigate('wishlist'),
            },
            {
              title: 'Notifications Center',
              icon: 'notifications-outline',
              action: () => navigate('notifications'),
            },
            {
              title: 'App Settings & Preferences',
              icon: 'settings-outline',
              action: () => navigate('settings'),
            },
            {
              title: 'Help & 24/7 AI Hardware Support',
              icon: 'help-buoy-outline',
              action: () => navigate('help_support'),
            },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.7}
              onPress={item.action}
              style={[
                styles.menuItem,
                { borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: colors.divider },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={[Typography.bodyMd, { color: colors.textPrimary, marginLeft: Spacing.md }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </VoltCard>

        {/* Sign Out Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[styles.signOutBtn, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[Typography.labelLg, { color: colors.error, fontWeight: '700', marginLeft: 6 }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center', marginTop: Spacing.md }]}>
          VoltTech Commerce Mobile v1.0.0 (Expo SDK 54)
        </Text>
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
    paddingTop: 36,
    paddingBottom: 40,
  },
  profileCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
  },
  fallbackAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.sm,
  },
  adminPortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  menuCard: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Roundness.md,
    marginTop: Spacing.xs,
  },
});
