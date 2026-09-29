import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import { CatalogProvider } from './src/context/CatalogContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { AddressProvider } from './src/context/AddressContext';
import { OrderProvider } from './src/context/OrderContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { NavigationProvider } from './src/context/NavigationContext';
import { RootNavigator } from './src/screens/RootNavigator';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CatalogProvider>
            <CartProvider>
              <WishlistProvider>
                <AddressProvider>
                  <OrderProvider>
                    <NotificationProvider>
                      <NavigationProvider>
                        <AppContent />
                      </NavigationProvider>
                    </NotificationProvider>
                  </OrderProvider>
                </AddressProvider>
              </WishlistProvider>
            </CartProvider>
          </CatalogProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
