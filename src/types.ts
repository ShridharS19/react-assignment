// src/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ProductFormData {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface ProductFormErrors {
  title?: string;
  price?: string;
  description?: string;
  category?: string;
  image?: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasMore: boolean;
}