import { User, RegisterDTO, LoginDTO } from '../types';
import { storage } from './storage.service';

const AUTH_USER_KEY = '@volttech_auth_user';
const USERS_LIST_KEY = '@volttech_registered_users';

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  register(dto: RegisterDTO): Promise<{ success: boolean; user?: User; error?: string }>;
  login(dto: LoginDTO): Promise<{ success: boolean; user?: User; error?: string }>;
  logout(): Promise<void>;
  forgotPassword(emailOrPhone: string, newPassword?: string): Promise<{ success: boolean; message: string }>;
  updateProfile(userId: string, updates: Partial<User>): Promise<User>;
}

// Pre-seeded initial accounts
const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-default',
    name: 'Rahul Sharma',
    email: 'rahul@volttech.io',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'customer',
    isVip: true,
    createdAt: new Date().toISOString(),
    passwordHash: 'password123',
  },
  {
    id: 'user-admin',
    name: 'Dev Admin',
    email: 'admin@volttech.io',
    phone: '+91 99999 88888',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    isVip: true,
    createdAt: new Date().toISOString(),
    passwordHash: 'admin123',
  },
];

class AuthService implements IAuthService {
  private async getRegisteredUsers(): Promise<(User & { passwordHash: string })[]> {
    const stored = await storage.getItem<(User & { passwordHash: string })[]>(USERS_LIST_KEY);
    if (!stored || stored.length === 0) {
      await storage.setItem(USERS_LIST_KEY, DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    return stored;
  }

  async getCurrentUser(): Promise<User | null> {
    const user = await storage.getItem<User>(AUTH_USER_KEY);
    if (user) {
      return user;
    }
    // Default to the customer account for seamless immediate app experience
    const defaultUser = DEFAULT_USERS[0];
    const { passwordHash: _, ...safeUser } = defaultUser;
    await storage.setItem(AUTH_USER_KEY, safeUser);
    return safeUser;
  }

  async register(dto: RegisterDTO): Promise<{ success: boolean; user?: User; error?: string }> {
    // 1. Validation
    if (!dto.name?.trim()) {
      return { success: false, error: 'Full name is required' };
    }
    if (!dto.email?.trim() || !dto.email.includes('@')) {
      return { success: false, error: 'Valid email address is required' };
    }
    if (!dto.phone?.trim() || dto.phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Valid 10-digit phone number is required' };
    }
    if (!dto.password || dto.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (dto.confirmPassword && dto.password !== dto.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const users = await this.getRegisteredUsers();

    // Check existing
    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === dto.email.trim().toLowerCase() ||
        u.phone.replace(/\D/g, '') === dto.phone.replace(/\D/g, '')
    );
    if (existing) {
      return { success: false, error: 'An account with this email or phone already exists' };
    }

    const newUser: User & { passwordHash: string } = {
      id: `user-${Date.now()}`,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      role: 'customer',
      isVip: true,
      createdAt: new Date().toISOString(),
      passwordHash: dto.password,
    };

    users.push(newUser);
    await storage.setItem(USERS_LIST_KEY, users);

    const { passwordHash: _, ...safeUser } = newUser;
    await storage.setItem(AUTH_USER_KEY, safeUser);

    return { success: true, user: safeUser };
  }

  async login(dto: LoginDTO): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!dto.emailOrPhone?.trim()) {
      return { success: false, error: 'Please enter your email or phone number' };
    }
    if (!dto.password) {
      return { success: false, error: 'Please enter your password' };
    }

    const users = await this.getRegisteredUsers();
    const query = dto.emailOrPhone.trim().toLowerCase();
    const cleanDigits = dto.emailOrPhone.replace(/\D/g, '');

    const found = users.find((u) => {
      const matchEmail = u.email.toLowerCase() === query;
      const matchPhone = cleanDigits.length >= 10 && u.phone.replace(/\D/g, '').endsWith(cleanDigits);
      return matchEmail || matchPhone;
    });

    if (!found) {
      return { success: false, error: 'No account found with this email/phone' };
    }

    if (found.passwordHash !== dto.password) {
      return { success: false, error: 'Incorrect password entered' };
    }

    const { passwordHash: _, ...safeUser } = found;
    await storage.setItem(AUTH_USER_KEY, safeUser);
    return { success: true, user: safeUser };
  }

  async logout(): Promise<void> {
    await storage.removeItem(AUTH_USER_KEY);
  }

  async forgotPassword(emailOrPhone: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    const users = await this.getRegisteredUsers();
    const query = emailOrPhone.trim().toLowerCase();
    const foundIndex = users.findIndex(
      (u) => u.email.toLowerCase() === query || u.phone.includes(query)
    );

    if (foundIndex === -1) {
      return { success: false, message: 'No registered user matches this detail.' };
    }

    if (newPassword && newPassword.length >= 6) {
      users[foundIndex].passwordHash = newPassword;
      await storage.setItem(USERS_LIST_KEY, users);
      return { success: true, message: 'Password has been successfully reset. You can now login.' };
    }

    return {
      success: true,
      message: `Password reset verification link has been sent to ${emailOrPhone}`,
    };
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = await this.getRegisteredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      await storage.setItem(USERS_LIST_KEY, users);
    }
    const current = await this.getCurrentUser();
    const updated = { ...(current || ({} as User)), ...updates };
    await storage.setItem(AUTH_USER_KEY, updated);
    return updated;
  }
}

export const authService = new AuthService();
