// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { LoginCredentials, User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  // Force re-render trigger
  const [, forceUpdate] = useState({});
  const triggerRerender = useCallback(() => {
    forceUpdate({});
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 Initializing auth...');
      
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('📦 Stored token:', !!token);
        console.log('📦 Stored user:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.token === token) {
            console.log('✅ Valid stored auth found');
            setUser(parsedUser);
            setAuthState('authenticated');
          } else {
            console.log('❌ Invalid stored auth, clearing');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthState('unauthenticated');
          }
        } else {
          console.log('❌ No stored auth found');
          setAuthState('unauthenticated');
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState('unauthenticated');
      } finally {
        setLoading(false);
        triggerRerender();
      }
    };

    initializeAuth();
  }, [triggerRerender]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('🔐 Attempting login...');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('✅ Login API success');
      
      // Create user object
      const userData: User = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        image: 'https://via.placeholder.com/150',
        token: data.token,
      };

      // Store in localStorage
      console.log('💾 Storing auth data...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      console.log('🔄 Updating auth state...');
      setUser(userData);
      setAuthState('authenticated');
      setError(null);
      setLoading(false);
      
      // Force component re-render
      setTimeout(() => {
        triggerRerender();
        console.log('🔄 Triggered re-render');
      }, 100);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
      setAuthState('unauthenticated');
      setLoading(false);
      return false;
    }
  }, [triggerRerender]);

  const logout = useCallback(() => {
    console.log('🚪 Logging out...');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('products_cache');
    localStorage.removeItem('deleted_product_ids');
    localStorage.removeItem('modified_products');
    localStorage.removeItem('added_products');
    
    // Update state
    setUser(null);
    setError(null);
    setAuthState('unauthenticated');
    setLoading(false);
    
    // Force component re-render
    setTimeout(() => {
      triggerRerender();
      console.log('🔄 Logout - Triggered re-render');
    }, 100);
  }, [triggerRerender]);

  const isAuthenticated = authState === 'authenticated' && !!user?.token;
  const isInitialized = authState !== 'checking';

  console.log('🔍 Auth Hook State:', {
    authState,
    isAuthenticated,
    isInitialized,
    hasUser: !!user,
    loading
  });

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isInitialized,
    authState, // Export for debugging
  };
};