// src/api.ts
// This file is optional - the hooks use fetch directly
// But if you want to centralize API calls, you can use this

import { LoginResponse, Product, LoginCredentials, ProductFormData } from './types';

const API_BASE = 'https://fakestoreapi.com';
const API_BASE_PAGINATED = 'https://fakestoreapi.in/api';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return response.json();
  },
};

export const productsAPI = {
  getProducts: async (page: number = 1, limit: number = 6) => {
    const response = await fetch(`${API_BASE_PAGINATED}/products?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  addProduct: async (productData: ProductFormData): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    return response.json();
  },

  updateProduct: async (id: number, productData: ProductFormData): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  },

  deleteProduct: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },
};