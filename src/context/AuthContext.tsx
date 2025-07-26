// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LoginCredentials, User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'RESET' };

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isInitialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'RESET':
      return { ...initialState, isInitialized: true, loading: false };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      console.log('Context: Initializing auth...');
      
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('Context: Stored token:', !!token);
        console.log('Context: Stored user:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.token === token) {
            console.log('Context: Valid stored auth found');
            dispatch({ type: 'SET_USER', payload: parsedUser });
          } else {
            console.log('Context: Invalid stored auth, clearing');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'SET_USER', payload: null });
          }
        } else {
          console.log('Context: No stored auth found');
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (err) {
        console.error('Context: Error parsing stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        console.log('🔄 Context: Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('Context: Attempting login...');
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

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
      console.log('Context: Login API success');
      
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
      console.log('Context: Storing auth data...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      console.log('Context: Setting user state...');
      dispatch({ type: 'SET_USER', payload: userData });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log('Context: Login complete, user set:', userData.username);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('Context: Login failed:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = () => {
    console.log('Context: Logging out...');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('products_cache');
    localStorage.removeItem('deleted_product_ids');
    localStorage.removeItem('modified_products');
    localStorage.removeItem('added_products');
    
    // Reset state
    dispatch({ type: 'RESET' });
    
    console.log('Context: Logout complete, user cleared');
  };

  const isAuthenticated = !!state.user?.token;

  console.log('Context State:', {
    isAuthenticated,
    isInitialized: state.isInitialized,
    hasUser: !!state.user,
    loading: state.loading,
    username: state.user?.username
  });

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};