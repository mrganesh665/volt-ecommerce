import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Address } from '../types';
import { addressService } from '../services/address.service';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  selectAddress: (id: string) => void;
  addAddress: (data: Omit<Address, 'id'>) => Promise<Address>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<Address>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType>({
  addresses: [],
  selectedAddress: null,
  loading: true,
  selectAddress: () => {},
  addAddress: async () => ({} as Address),
  updateAddress: async () => ({} as Address),
  deleteAddress: async () => false,
  setDefaultAddress: async () => {},
  refreshAddresses: async () => {},
});

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAddresses = useCallback(async () => {
    setLoading(true);
    const list = await addressService.getAddresses();
    setAddresses(list);
    const defaultAddr = list.find((a) => a.isDefault) || list[0] || null;
    setSelectedAddress(defaultAddr);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const selectAddress = (id: string) => {
    const found = addresses.find((a) => a.id === id);
    if (found) {
      setSelectedAddress(found);
    }
  };

  const addAddress = async (data: Omit<Address, 'id'>) => {
    const created = await addressService.addAddress(data);
    await refreshAddresses();
    if (created.isDefault || !selectedAddress) {
      setSelectedAddress(created);
    }
    return created;
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    const updated = await addressService.updateAddress(id, updates);
    await refreshAddresses();
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated);
    }
    return updated;
  };

  const deleteAddress = async (id: string) => {
    const success = await addressService.deleteAddress(id);
    await refreshAddresses();
    return success;
  };

  const setDefaultAddress = async (id: string) => {
    const updatedList = await addressService.setDefaultAddress(id);
    setAddresses(updatedList);
    const def = updatedList.find((a) => a.id === id) || null;
    setSelectedAddress(def);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        loading,
        selectAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
