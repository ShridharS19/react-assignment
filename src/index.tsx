// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// PrimeReact imports
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// PrimeReact Configuration
import { PrimeReactProvider } from 'primereact/api';

// Custom styles
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// PrimeReact configuration
const primeReactConfig = {
  ripple: false, // Disable ripple effect globally
  inputStyle: 'outlined' as const,
  locale: 'en',
  cssTransition: false, // Disable CSS transitions
  autoZIndex: true,
  hideOverlaysOnDocumentScrolling: false, // This fixes the error
  nullSortOrder: 1,
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
    toast: 1200
  }
};

root.render(
  <React.StrictMode>
    <PrimeReactProvider value={primeReactConfig}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);