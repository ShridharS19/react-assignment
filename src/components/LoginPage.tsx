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
  const [username, setUsername] = useState('mor_2314');
  const [password, setPassword] = useState('83r5^_');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef<Toast>(null);
  const { login, loading, error, isAuthenticated } = useAuth();

  console.log('👤 LoginPage render:', { isAuthenticated, loading, isSubmitting });

  // Watch for authentication success
  useEffect(() => {
    if (isAuthenticated && !loading && !isSubmitting) {
      console.log('✅ LoginPage detected authentication success');
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful! Loading products...',
        life: 2000,
      });
      
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    }
  }, [isAuthenticated, loading, isSubmitting, onLoginSuccess]);

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

    console.log('🔐 Starting login process...');
    setIsSubmitting(true);

    try {
      const success = await login({ username, password });
      
      if (!success) {
        console.log('❌ Login failed');
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: error || 'Invalid credentials. Please check your username and password.',
          life: 5000,
        });
        setIsSubmitting(false);
      } else {
        console.log('✅ Login success, waiting for state update...');
        // Don't set isSubmitting to false here - let the useEffect handle the success
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred. Please try again.',
        life: 5000,
      });
      setIsSubmitting(false);
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

  const isLoading = loading || isSubmitting;

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
                disabled={isLoading}
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
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <small className="p-error">{errors.password}</small>
              )}
            </div>

            <Button
              type="submit"
              label={isLoading ? undefined : "Sign In"}
              className="w-full login-button"
              disabled={isLoading}
              icon={isLoading ? undefined : "pi pi-sign-in"}
            >
              {isLoading && (
                <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />
              )}
            </Button>
          </form>

          <div className="login-info">
            <div className="demo-credentials">
              <h4>Demo Credentials (Pre-filled):</h4>
              <p><strong>Username:</strong> mor_2314</p>
              <p><strong>Password:</strong> 83r5^_</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Just click "Sign In" to continue!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;