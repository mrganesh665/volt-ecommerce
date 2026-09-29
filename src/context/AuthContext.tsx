import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterDTO, LoginDTO } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (dto: LoginDTO) => Promise<{ success: boolean; error?: string }>;
  register: (dto: RegisterDTO) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (emailOrPhone: string, newPassword?: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleAdminRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  forgotPassword: async () => ({ success: false, message: '' }),
  updateProfile: async () => {},
  toggleAdminRole: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (dto: LoginDTO) => {
    setLoading(true);
    const res = await authService.login(dto);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const register = async (dto: RegisterDTO) => {
    setLoading(true);
    const res = await authService.register(dto);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const forgotPassword = async (emailOrPhone: string, newPassword?: string) => {
    return authService.forgotPassword(emailOrPhone, newPassword);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const toggleAdminRole = async () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    await updateProfile({ role: newRole });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
