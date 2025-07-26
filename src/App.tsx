// src/App.tsx
import React, { useState, useEffect } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoginSuccess = () => {
    setIsTransitioning(true);
    // Small delay to show success message, then transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
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

  // Show loading spinner while checking authentication or transitioning
  if (loading || isTransitioning) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" />
          <p>{isTransitioning ? 'Loading your products...' : 'Loading...'}</p>
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

export default App;