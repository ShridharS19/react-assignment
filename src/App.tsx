// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { addLocale } from 'primereact/api';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import ProductList from './components/ProductList';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, loading, isInitialized, authState, user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [resetDataFn, setResetDataFn] = useState<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState<'loading' | 'login' | 'products'>('loading');

  // Initialize PrimeReact locale
  useEffect(() => {
    addLocale('en', {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk'
    });
  }, []);

  // Handle view changes based on auth state
  useEffect(() => {
    console.log('🔄 App Effect - Auth State Changed:', {
      isAuthenticated,
      isInitialized,
      authState,
      hasUser: !!user,
      loading,
      isTransitioning
    });

    if (loading || !isInitialized || isTransitioning) {
      setCurrentView('loading');
    } else if (isAuthenticated) {
      setCurrentView('products');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated, isInitialized, authState, user, loading, isTransitioning]);

  const handleLoginSuccess = () => {
    console.log('✅ Login success callback triggered');
    setIsTransitioning(true);
    
    // Short transition delay
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentView('products');
      console.log('🔄 Transition complete, showing products');
    }, 1000);
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleHideAddForm = () => {
    setShowAddForm(false);
  };

  const handleResetData = () => {
    if (resetDataFn) {
      resetDataFn();
    }
  };

  const setResetFunction = (fn: () => void) => {
    setResetDataFn(() => fn);
  };

  console.log('🖥️ App Render - Current View:', currentView);

  // Loading view
  if (currentView === 'loading') {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
          <p>
            {isTransitioning 
              ? 'Loading your products...' 
              : loading 
                ? 'Checking authentication...' 
                : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  // Login view
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Products view
  if (currentView === 'products') {
    return (
      <div className="app fade-in">
        <Header 
          onAddProduct={handleAddProduct} 
          onResetData={handleResetData}
        />
        <main className="app-main">
          <ProductList
            showAddForm={showAddForm}
            onHideAddForm={handleHideAddForm}
            onResetData={setResetFunction}
          />
        </main>
      </div>
    );
  }

  // Fallback
  return (
    <div className="app-loading">
      <div className="loading-content">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default App;