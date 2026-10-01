import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap first so the project theme can override it.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
