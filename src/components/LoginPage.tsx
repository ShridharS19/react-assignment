// src/components/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const toast = useRef<Toast>(null);
  const { login, loading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await login({ username, password });
    
    if (success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful!',
        life: 2000,
      });
      // The login state change will automatically trigger the app to show products
      // No manual timeout needed
      onLoginSuccess();
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error || 'Login failed',
        life: 5000,
      });
    }
  };

  useEffect(() => {
    // Clear individual field errors when user starts typing
    if (username && errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
    if (password && errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [username, password, errors]);

  const cardHeader = (
    <div className="login-header">
      <i className="pi pi-shopping-cart" style={{ fontSize: '2rem', color: 'white' }} />
      <h2>Product Manager</h2>
      <p>Sign in to manage your products</p>
    </div>
  );

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="login-wrapper">
        <Card header={cardHeader} className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="username" className="block">
                Username
              </label>
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                disabled={loading}
                autoComplete="username"
              />
              {errors.username && (
                <small className="p-error">{errors.username}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="password" className="block">
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                toggleMask
                feedback={false}
                disabled={loading}
                autoComplete="current-password"
              />
              {errors.password && (
                <small className="p-error">{errors.password}</small>
              )}
            </div>

            <Button
              type="submit"
              label={loading ? undefined : "Sign In"}
              className="w-full login-button"
              disabled={loading}
              icon={loading ? undefined : "pi pi-sign-in"}
            >
              {loading && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />}
            </Button>
          </form>

          <div className="login-info">
            <div className="demo-credentials">
              <h4>Demo Credentials:</h4>
              <p><strong>Username:</strong> mor_2314</p>
              <p><strong>Password:</strong> 83r5^_</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;