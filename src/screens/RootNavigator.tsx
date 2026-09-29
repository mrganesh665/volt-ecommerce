import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { VoltBottomNav } from '../components/common/VoltBottomNav';

// Screens
import { LoginScreen } from './auth/LoginScreen';
import { RegisterScreen } from './auth/RegisterScreen';
import { ForgotPasswordScreen } from './auth/ForgotPasswordScreen';
import { HomeScreen } from './home/HomeScreen';
import { SearchScreen } from './search/SearchScreen';
import { CategoriesScreen } from './catalog/CategoriesScreen';
import { ProductListScreen } from './catalog/ProductListScreen';
import { ProductDetailScreen } from './catalog/ProductDetailScreen';
import { WishlistScreen } from './catalog/WishlistScreen';
import { CartScreen } from './cart/CartScreen';
import { AddressManagementScreen } from './checkout/AddressManagementScreen';
import { CheckoutScreen } from './checkout/CheckoutScreen';
import { RazorpayPaymentScreen } from './checkout/RazorpayPaymentScreen';
import { OrderSuccessScreen } from './checkout/OrderSuccessScreen';
import { OrderHistoryScreen } from './orders/OrderHistoryScreen';
import { OrderDetailScreen } from './orders/OrderDetailScreen';
import { NotificationsScreen } from './notifications/NotificationsScreen';
import { ProfileScreen } from './profile/ProfileScreen';
import { SettingsScreen } from './settings/SettingsScreen';
import { HelpSupportScreen } from './support/HelpSupportScreen';
import { AdminDashboardScreen } from './admin/AdminDashboardScreen';
import { AdminProductsScreen } from './admin/AdminProductsScreen';
import { AdminProductEditScreen } from './admin/AdminProductEditScreen';
import { AdminOrdersScreen } from './admin/AdminOrdersScreen';

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute } = useNavigation();
  const { isAuthenticated, loading } = useAuth();

  const renderScreen = () => {
    switch (currentRoute.name) {
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'forgot_password':
        return <ForgotPasswordScreen />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'product_list':
        return <ProductListScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'cart':
        return <CartScreen />;
      case 'address_select':
        return <AddressManagementScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'razorpay_payment':
        return <RazorpayPaymentScreen />;
      case 'order_success':
        return <OrderSuccessScreen />;
      case 'order_history':
        return <OrderHistoryScreen />;
      case 'order_detail':
        return <OrderDetailScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'help_support':
        return <HelpSupportScreen />;
      case 'admin_dashboard':
        return <AdminDashboardScreen />;
      case 'admin_products':
        return <AdminProductsScreen />;
      case 'admin_product_edit':
        return <AdminProductEditScreen />;
      case 'admin_orders':
        return <AdminOrdersScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Bottom navigation visibility
  const showBottomNav = [
    'home',
    'search',
    'categories',
    'wishlist',
    'cart',
    'profile',
    'order_history',
  ].includes(currentRoute.name);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.screenArea}>{renderScreen()}</View>
      {showBottomNav && <VoltBottomNav />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenArea: {
    flex: 1,
  },
});
