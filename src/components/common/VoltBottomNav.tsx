import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing } from '../../theme';
import { useNavigation, TabName } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const VoltBottomNav: React.FC = () => {
  const { colors } = useTheme();
  const { activeTab, switchTab } = useNavigation();
  const { totals } = useCart();
  const { favorites } = useWishlist();

  const tabs: {
    name: TabName;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    badgeCount?: number;
  }[] = [
    { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
    {
      name: 'wishlist',
      label: 'Wishlist',
      icon: 'heart-outline',
      activeIcon: 'heart',
      badgeCount: favorites.length,
    },
    {
      name: 'cart',
      label: 'Cart',
      icon: 'cart-outline',
      activeIcon: 'cart',
      badgeCount: totals.itemsCount,
    },
    { name: 'profile', label: 'Account', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.divider,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const color = isActive ? colors.primary : colors.textTertiary;

        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={0.7}
            onPress={() => switchTab(tab.name)}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={color}
              />
              {!!tab.badgeCount && tab.badgeCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        tab.name === 'cart' ? colors.primary : colors.secondary,
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{tab.badgeCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                Typography.labelSm,
                {
                  color,
                  fontWeight: isActive ? '700' : '500',
                  marginTop: 2,
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    color: '#001f26',
    fontWeight: '800',
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
