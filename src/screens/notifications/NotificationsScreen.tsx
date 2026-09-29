import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useNotifications } from '../../context/NotificationContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'cube-outline' as const, color: colors.tertiary };
      case 'deal':
        return { name: 'flash-outline' as const, color: colors.primary };
      case 'security':
        return { name: 'shield-checkmark-outline' as const, color: colors.secondary };
      default:
        return { name: 'notifications-outline' as const, color: colors.textSecondary };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
        showLogo={false}
        showDelivery={false}
        rightAction={
          notifications.length > 0 ? (
            <TouchableOpacity activeOpacity={0.7} onPress={markAllAsRead}>
              <Text style={[Typography.labelSm, { color: colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          <View style={styles.list}>
            {notifications.map((notif) => {
              const icon = getIcon(notif.type);

              return (
                <VoltCard
                  key={notif.id}
                  variant="glass"
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: notif.read
                        ? colors.surfaceContainer
                        : colors.surfaceContainerHigh,
                    },
                  ]}
                  onPress={() => {
                    markAsRead(notif.id);
                    if (notif.orderId) {
                      navigate('order_detail', { orderId: notif.orderId });
                    }
                  }}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerLowest }]}>
                    <Ionicons name={icon.name} size={22} color={icon.color} />
                  </View>

                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <View style={styles.cardTop}>
                      <Text
                        style={[
                          Typography.labelLg,
                          {
                            color: colors.textPrimary,
                            fontWeight: notif.read ? '600' : '800',
                            flex: 1,
                          },
                        ]}
                      >
                        {notif.title}
                      </Text>
                      {!notif.read && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                      )}
                    </View>

                    <Text
                      style={[
                        Typography.bodyMd,
                        { color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
                      ]}
                    >
                      {notif.message}
                    </Text>

                    <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: Spacing.xs, fontSize: 11 }]}>
                      {notif.timestamp}
                    </Text>
                  </View>
                </VoltCard>
              );
            })}

            <TouchableOpacity activeOpacity={0.7} onPress={clearAll} style={styles.clearAllBtn}>
              <Text style={[Typography.labelMd, { color: colors.textTertiary }]}>
                Clear All Notifications
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyCircle, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="notifications-off-outline" size={40} color={colors.textTertiary} />
            </View>
            <Text style={[Typography.headlineMd, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              No Notifications
            </Text>
            <Text style={[Typography.bodyMd, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs }]}>
              You are all caught up with your orders, deals, and account security alerts.
            </Text>
          </View>
        )}
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
  list: {
    gap: Spacing.sm,
  },
  notifCard: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  clearAllBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.xl,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
