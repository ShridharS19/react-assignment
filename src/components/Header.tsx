// src/components/Header.tsx
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '../context/AuthContext';
import './Header.css';

interface HeaderProps {
  onAddProduct: () => void;
  onResetData: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddProduct, onResetData }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log('🚪 Header: Logout button clicked');
    logout();
  };

  const startContent = (
    <div className="header-start">
      <i className="pi pi-shopping-cart header-icon" />
      <span className="header-title">Product Manager</span>
    </div>
  );

  const endContent = (
    <div className="header-end">
      <Button
        label="Add Product"
        icon="pi pi-plus"
        className="p-button-success add-product-btn"
        onClick={onAddProduct}
      />
      
      <Button
        icon="pi pi-refresh"
        className="p-button-outlined p-button-secondary reset-btn"
        onClick={onResetData}
        tooltip="Reset to original data"
        tooltipOptions={{ position: 'bottom' }}
      />
      
      <div className="user-info">
        <Avatar
          label={user?.firstName?.charAt(0) || 'U'}
          className="user-avatar"
          shape="circle"
        />
        <span className="username">{user?.username}</span>
      </div>
      
      <Button
        icon="pi pi-sign-out"
        className="p-button-text logout-btn"
        onClick={handleLogout}
        tooltip="Logout"
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );

  return (
    <Toolbar
      start={startContent}
      end={endContent}
      className="main-header"
    />
  );
};

export default Header;