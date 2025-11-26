import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </StrictMode>,
);
