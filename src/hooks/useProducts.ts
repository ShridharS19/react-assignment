// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData, PaginationInfo } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'products_cache',
  DELETED_IDS: 'deleted_product_ids',
  MODIFIED_PRODUCTS: 'modified_products',
  ADDED_PRODUCTS: 'added_products',
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    limit: 6,
    hasMore: true,
  });

  // Helper functions for localStorage management
  const getStorageData = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const setStorageData = <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const getDeletedIds = (): number[] => getStorageData(STORAGE_KEYS.DELETED_IDS, []);
  const getModifiedProducts = (): Record<number, Product> => getStorageData(STORAGE_KEYS.MODIFIED_PRODUCTS, {});
  const getAddedProducts = (): Product[] => getStorageData(STORAGE_KEYS.ADDED_PRODUCTS, []);

  const applyLocalModifications = (apiProducts: Product[]): Product[] => {
    const deletedIds = getDeletedIds();
    const modifiedProducts = getModifiedProducts();
    const addedProducts = getAddedProducts();

    // Filter out deleted products
    let filteredProducts = apiProducts.filter(product => !deletedIds.includes(product.id));

    // Apply modifications
    filteredProducts = filteredProducts.map(product => 
      modifiedProducts[product.id] || product
    );

    // Add new products at the beginning
    return [...addedProducts, ...filteredProducts];
  };

  const fetchProducts = useCallback(async (page: number = 1, limit: number = 6, loadMore: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      // Using fakestoreapi.in for pagination support
      const response = await fetch(`https://fakestoreapi.in/api/products?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      // Apply local modifications to the fetched data
      const modifiedApiProducts = applyLocalModifications(data.products);
      
      if (loadMore) {
        setProducts(prev => {
          // When loading more, apply modifications to existing products too
          const existingModified = applyLocalModifications(prev);
          // Filter out duplicates and add new products
          const existingIds = new Set(existingModified.map(p => p.id));
          const newProducts = modifiedApiProducts.filter(p => !existingIds.has(p.id));
          return [...existingModified, ...newProducts];
        });
      } else {
        setProducts(modifiedApiProducts);
      }

      setPagination({
        currentPage: page,
        totalPages: Math.ceil(data.total / limit),
        limit,
        hasMore: page < Math.ceil(data.total / limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: ProductFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      
      // Create product with unique ID for persistence
      const productWithId: Product = {
        ...newProduct,
        id: Date.now(), // Unique ID for local storage
      };
      
      // Save to localStorage
      const addedProducts = getAddedProducts();
      const updatedAddedProducts = [productWithId, ...addedProducts];
      setStorageData(STORAGE_KEYS.ADDED_PRODUCTS, updatedAddedProducts);
      
      // Update local state
      setProducts(prev => [productWithId, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: ProductFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProductData = await response.json();
      const updatedProduct: Product = { ...updatedProductData, id };
      
      // Save to localStorage
      const modifiedProducts = getModifiedProducts();
      modifiedProducts[id] = updatedProduct;
      setStorageData(STORAGE_KEYS.MODIFIED_PRODUCTS, modifiedProducts);
      
      // Update local state
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Check if it's a user-added product
      const addedProducts = getAddedProducts();
      const isAddedProduct = addedProducts.some(p => p.id === id);
      
      if (isAddedProduct) {
        // Remove from added products
        const filteredAddedProducts = addedProducts.filter(p => p.id !== id);
        setStorageData(STORAGE_KEYS.ADDED_PRODUCTS, filteredAddedProducts);
      } else {
        // Add to deleted IDs for API products
        const deletedIds = getDeletedIds();
        if (!deletedIds.includes(id)) {
          setStorageData(STORAGE_KEYS.DELETED_IDS, [...deletedIds, id]);
        }
      }
      
      // Remove from modified products if it exists
      const modifiedProducts = getModifiedProducts();
      if (modifiedProducts[id]) {
        delete modifiedProducts[id];
        setStorageData(STORAGE_KEYS.MODIFIED_PRODUCTS, modifiedProducts);
      }
      
      // Update local state
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchProducts(pagination.currentPage + 1, pagination.limit, true);
    }
  };

  // Clear all local data (utility function for testing/reset)
  const clearLocalData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    fetchProducts(); // Refetch fresh data
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    loadMore,
    clearLocalData, // Export for debugging/testing
  };
};