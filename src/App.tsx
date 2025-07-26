// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { addLocale } from 'primereact/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import ProductList from './components/ProductList';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [resetDataFn, setResetDataFn] = useState<(() => void) | null>(null);

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

  console.log('🖥️ AppContent Render:', {
    isAuthenticated,
    isInitialized,
    loading
  });

  // Show loading only during initial auth check
  if (!isInitialized) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    console.log('🖥️ AppContent: Showing login page');
    return <LoginPage />;
  }

  // Show products page if authenticated
  console.log('🖥️ AppContent: Showing products page');
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
};

const App: React.FC = () => {
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

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;