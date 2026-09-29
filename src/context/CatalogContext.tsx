import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../types';
import { catalogService } from '../services/catalog.service';

interface CatalogContextType {
  products: Product[];
  categories: Category[];
  flashDeals: Product[];
  featured: Product[];
  loading: boolean;
  refreshCatalog: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  products: [],
  categories: [],
  flashDeals: [],
  featured: [],
  loading: true,
  refreshCatalog: async () => {},
  getProductById: () => undefined,
  addProduct: async () => ({} as Product),
  updateProduct: async () => ({} as Product),
  deleteProduct: async () => false,
  resetCatalog: async () => {},
});

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      catalogService.getProducts(),
      catalogService.getCategories(),
    ]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const addProduct = async (data: Omit<Product, 'id'>) => {
    const created = await catalogService.addProduct(data);
    await refreshCatalog();
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await catalogService.updateProduct(id, updates);
    await refreshCatalog();
    return updated;
  };

  const deleteProduct = async (id: string) => {
    const ok = await catalogService.deleteProduct(id);
    await refreshCatalog();
    return ok;
  };

  const resetCatalog = async () => {
    await catalogService.resetCatalog();
    await refreshCatalog();
  };

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        flashDeals,
        featured,
        loading,
        refreshCatalog,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => useContext(CatalogContext);
