
import type { Product } from '../types.js';
import { INITIAL_PRODUCTS, PRODUCTS_STORAGE_KEY } from '../constants.js';

export const getProductsFromStorage = (): Product[] => {
  const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts);
    } catch (e) {
      console.error("Failed to parse products from localStorage", e);
      // Fallback to initial products if parsing fails
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
  }
  // Initialize localStorage if empty
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveProductsToStorage = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

export const getProductByIdFromStorage = (productId: string): Product | undefined => {
  const products = getProductsFromStorage();
  return products.find(p => p.id === productId);
};