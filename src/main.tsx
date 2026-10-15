import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './lib/env'; // Validate env first - throws if missing
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
