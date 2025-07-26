// src/hooks/useAuth.ts
import { useState, useEffect, useCallback, useReducer } from 'react';
import { LoginCredentials, User } from '../types';

// Simple reducer to force re-renders
const forceUpdateReducer = (x: number) => x + 1;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing auth...');
      
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('Stored token:', !!token);
        console.log('Stored user:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.token === token) {
            console.log('Valid stored auth found');
            setUser(parsedUser);
          } else {
            console.log('Invalid stored auth, clearing');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          console.log('No stored auth found');
          setUser(null);
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
        forceUpdate(); // Force a re-render
        console.log('Auth initialization complete');
      }
    };

    // Small delay to ensure proper initialization
    setTimeout(initializeAuth, 100);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('Attempting login...');
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
      console.log('Login API success');
      
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
      console.log('Storing auth data...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state and force re-render
      console.log('Setting user state...');
      setUser(userData);
      setError(null);
      setLoading(false);
      
      // Force re-render after state update
      setTimeout(() => {
        forceUpdate();
        console.log('Forced re-render after login');
      }, 100);
      
      console.log('Login complete, user set:', userData.username);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('Login failed:', errorMessage);
      setError(errorMessage);
      setUser(null);
      setLoading(false);
      forceUpdate();
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out...');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('products_cache');
    localStorage.removeItem('deleted_product_ids');
    localStorage.removeItem('modified_products');
    localStorage.removeItem('added_products');
    
    // Update state and force re-render
    setUser(null);
    setError(null);
    setLoading(false);
    
    // Force re-render after state update
    setTimeout(() => {
      forceUpdate();
      console.log('Forced re-render after logout');
    }, 100);
    
    console.log('Logout complete, user cleared');
  }, []);

  const isAuthenticated = !!user?.token;

  console.log('Auth Hook State:', {
    isAuthenticated,
    isInitialized,
    hasUser: !!user,
    loading,
    username: user?.username
  });

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isInitialized,
  };
};