import { Address } from '../types';
import { INITIAL_ADDRESSES } from './mockData';
import { storage } from './storage.service';

const ADDRESSES_STORAGE_KEY = '@volttech_user_addresses';

export interface IAddressService {
  getAddresses(userId?: string): Promise<Address[]>;
  getAddressById(id: string): Promise<Address | null>;
  addAddress(address: Omit<Address, 'id'>): Promise<Address>;
  updateAddress(id: string, updates: Partial<Address>): Promise<Address>;
  deleteAddress(id: string): Promise<boolean>;
  setDefaultAddress(id: string): Promise<Address[]>;
}

class AddressService implements IAddressService {
  async getAddresses(userId?: string): Promise<Address[]> {
    const list = await storage.getItem<Address[]>(ADDRESSES_STORAGE_KEY);
    if (!list || list.length === 0) {
      await storage.setItem(ADDRESSES_STORAGE_KEY, INITIAL_ADDRESSES);
      return INITIAL_ADDRESSES;
    }
    if (userId) {
      // return user addresses or default seeded ones
      return list.filter((a) => a.userId === userId || a.userId === 'user-default');
    }
    return list;
  }

  async getAddressById(id: string): Promise<Address | null> {
    const list = await this.getAddresses();
    return list.find((a) => a.id === id) || null;
  }

  async addAddress(data: Omit<Address, 'id'>): Promise<Address> {
    const list = await this.getAddresses();
    const newAddress: Address = {
      ...data,
      id: `addr-${Date.now()}`,
      isDefault: data.isDefault || list.length === 0,
    };

    let updated = [...list];
    if (newAddress.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated.push(newAddress);
    await storage.setItem(ADDRESSES_STORAGE_KEY, updated);
    return newAddress;
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
    const list = await this.getAddresses();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Address ${id} not found`);
    }

    let updated = [...list];
    if (updates.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    const modified = { ...updated[index], ...updates };
    updated[index] = modified;
    await storage.setItem(ADDRESSES_STORAGE_KEY, updated);
    return modified;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const list = await this.getAddresses();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    await storage.setItem(ADDRESSES_STORAGE_KEY, filtered);
    return true;
  }

  async setDefaultAddress(id: string): Promise<Address[]> {
    const list = await this.getAddresses();
    const updated = list.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await storage.setItem(ADDRESSES_STORAGE_KEY, updated);
    return updated;
  }
}

export const addressService = new AddressService();
