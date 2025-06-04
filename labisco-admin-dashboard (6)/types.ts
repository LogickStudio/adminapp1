
import type { ReactNode } from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon: (props: { className?: string }) => ReactNode;
}

export interface ProductVariant {
  id: string;          // Unique ID for the variant
  name: string;        // e.g., "100g", "250ml", "Small", "Large"
  price: number;
  stock: number;
  sku?: string;         // Optional: Stock Keeping Unit
}

export interface Product {
  id: string;
  name:string;
  category: string;
  imageUrls?: string[];
  description?: string;
  variants: ProductVariant[]; // Changed: holds all product variations
}

export interface StatCardData {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string; // e.g., "+5% from last month"
  changeType?: 'positive' | 'negative';
}

export interface SalesData {
  month: string;
  sales: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
}

export interface ShopSettings {
  shopName: string;
  currency: string;
  timezone: string;
  notifications: {
    newOrders: boolean;
    lowStock: boolean;
  };
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  // Add other user properties if needed
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}