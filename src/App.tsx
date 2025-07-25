// src/App.tsx
import React, { useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import ProductList from './components/ProductList';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [resetDataFn, setResetDataFn] = useState<(() => void) | null>(null);

  const handleLoginSuccess = () => {
    // Login success is handled by the useAuth hook
    // This callback can be used for additional logic if needed
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main application if authenticated
  return (
    <div className="app">
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

export default App;