import { Category, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './mockData';
import { storage } from './storage.service';

const PRODUCTS_STORAGE_KEY = '@volttech_catalog_products';
const CATEGORIES_STORAGE_KEY = '@volttech_catalog_categories';

export interface ICatalogService {
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(params: {
    query?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'popularity' | 'price_low' | 'price_high' | 'rating';
  }): Promise<Product[]>;
  getFlashDeals(): Promise<Product[]>;
  getFeatured(): Promise<Product[]>;
  // Admin Operations
  addProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  resetCatalog(): Promise<void>;
}

class CatalogService implements ICatalogService {
  async getCategories(): Promise<Category[]> {
    const cached = await storage.getItem<Category[]>(CATEGORIES_STORAGE_KEY);
    if (!cached || cached.length === 0) {
      await storage.setItem(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return cached;
  }

  async getProducts(): Promise<Product[]> {
    const cached = await storage.getItem<Product[]>(PRODUCTS_STORAGE_KEY);
    if (!cached || cached.length === 0) {
      await storage.setItem(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return cached;
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  async searchProducts(params: {
    query?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'popularity' | 'price_low' | 'price_high' | 'rating';
  }): Promise<Product[]> {
    let list = await this.getProducts();

    if (params.categoryId && params.categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === params.categoryId);
    }

    if (params.query?.trim()) {
      const q = params.query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (typeof params.minPrice === 'number') {
      list = list.filter((p) => p.price >= params.minPrice!);
    }
    if (typeof params.maxPrice === 'number') {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_low':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
        default:
          list.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    return list;
  }

  async getFlashDeals(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.isFlashDeal);
  }

  async getFeatured(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.isFeatured);
  }

  async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    await storage.setItem(PRODUCTS_STORAGE_KEY, updated);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product ${id} not found`);
    }
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    await storage.setItem(PRODUCTS_STORAGE_KEY, products);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    await storage.setItem(PRODUCTS_STORAGE_KEY, filtered);
    return true;
  }

  async resetCatalog(): Promise<void> {
    await storage.setItem(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    await storage.setItem(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
  }
}

export const catalogService = new CatalogService();
