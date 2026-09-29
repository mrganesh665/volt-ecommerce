import React, { createContext, useContext, useState, useCallback } from 'react';

export type ScreenName =
  | 'home'
  | 'search'
  | 'categories'
  | 'product_list'
  | 'product_detail'
  | 'wishlist'
  | 'cart'
  | 'address_select'
  | 'checkout'
  | 'razorpay_payment'
  | 'order_success'
  | 'order_history'
  | 'order_detail'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'help_support'
  | 'admin_dashboard'
  | 'admin_products'
  | 'admin_product_edit'
  | 'admin_orders'
  | 'login'
  | 'register'
  | 'forgot_password';

export interface RouteState {
  name: ScreenName;
  params?: Record<string, any>;
}

export type TabName = 'home' | 'search' | 'wishlist' | 'cart' | 'profile';

interface NavigationContextType {
  currentRoute: RouteState;
  activeTab: TabName;
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  replace: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => boolean;
  canGoBack: boolean;
  switchTab: (tab: TabName) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentRoute: { name: 'home' },
  activeTab: 'home',
  navigate: () => {},
  replace: () => {},
  goBack: () => false,
  canGoBack: false,
  switchTab: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<RouteState[]>([{ name: 'home' }]);
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const currentRoute = history[history.length - 1] || { name: 'home' };
  const canGoBack = history.length > 1;

  const navigate = useCallback((name: ScreenName, params?: Record<string, any>) => {
    // If navigating to a primary tab root, update the active tab
    if (name === 'home' || name === 'search' || name === 'wishlist' || name === 'cart' || name === 'profile') {
      setActiveTab(name as TabName);
    }
    setHistory((prev) => [...prev, { name, params }]);
  }, []);

  const replace = useCallback((name: ScreenName, params?: Record<string, any>) => {
    if (name === 'home' || name === 'search' || name === 'wishlist' || name === 'cart' || name === 'profile') {
      setActiveTab(name as TabName);
    }
    setHistory((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { name, params };
      return copy;
    });
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => {
        const next = prev.slice(0, prev.length - 1);
        const top = next[next.length - 1];
        if (top.name === 'home' || top.name === 'search' || top.name === 'wishlist' || top.name === 'cart' || top.name === 'profile') {
          setActiveTab(top.name as TabName);
        }
        return next;
      });
      return true;
    }
    return false;
  }, [history]);

  const switchTab = useCallback((tab: TabName) => {
    setActiveTab(tab);
    setHistory((prev) => [...prev, { name: tab as ScreenName }]);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        activeTab,
        navigate,
        replace,
        goBack,
        canGoBack,
        switchTab,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
