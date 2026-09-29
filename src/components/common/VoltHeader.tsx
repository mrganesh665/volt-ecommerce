import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useAddress } from '../../context/AddressContext';

interface VoltHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showDelivery?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  rightAction?: React.ReactNode;
}

export const VoltHeader: React.FC<VoltHeaderProps> = ({
  title,
  showBack,
  showLogo = true,
  showDelivery = true,
  showNotification = true,
  showProfile = true,
  rightAction,
}) => {
  const { colors } = useTheme();
  const { navigate, goBack, canGoBack } = useNavigation();
  const { unreadCount } = useNotifications();
  const { user, isAdmin } = useAuth();
  const { selectedAddress } = useAddress();

  const shouldShowBack = showBack ?? canGoBack;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerLowest,
          borderBottomColor: colors.divider,
        },
      ]}
    >
      <View style={styles.leftSection}>
        {shouldShowBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goBack()}
            style={[styles.iconButton, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}

        {showLogo && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigate('home')}
            style={styles.logoRow}
          >
            <View style={[styles.boltIconContainer, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="flash" size={16} color={colors.onPrimaryContainer} />
            </View>
            <View style={styles.brandColumn}>
              <View style={styles.brandTitleRow}>
                <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '800' }]}>
                  VoltTech
                </Text>
                {isAdmin && (
                  <View style={[styles.adminPill, { backgroundColor: colors.secondaryContainer }]}>
                    <Text style={[Typography.labelSm, { color: colors.secondaryLight, fontSize: 9 }]}>
                      ADMIN
                    </Text>
                  </View>
                )}
              </View>
              {showDelivery && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigate('address_select')}
                  style={styles.deliveryRow}
                >
                  <Ionicons name="location-sharp" size={11} color={colors.primary} />
                  <Text
                    numberOfLines={1}
                    style={[Typography.bodySm, { color: colors.textSecondary, fontSize: 11, marginLeft: 2 }]}
                  >
                    Deliver to {selectedAddress?.city || 'Bengaluru'} {selectedAddress?.pincode || '560103'}
                  </Text>
                  <Ionicons name="chevron-down" size={10} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}

        {!showLogo && title && (
          <Text
            numberOfLines={1}
            style={[
              Typography.headlineSm,
              { color: colors.textPrimary, fontWeight: '700', marginLeft: shouldShowBack ? Spacing.sm : 0 },
            ]}
          >
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightAction}

        {showNotification && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('notifications')}
            style={[styles.iconButton, { backgroundColor: colors.surfaceContainerLow }]}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={[styles.unreadDot, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('profile')}
            style={styles.profileBtn}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={[styles.avatar, { borderColor: colors.primary }]} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                  { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.primary },
                ]}
              >
                <Ionicons name="person" size={16} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boltIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  brandColumn: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminPill: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadText: {
    fontSize: 9,
    color: '#003640',
    fontWeight: '800',
  },
  profileBtn: {
    marginLeft: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
