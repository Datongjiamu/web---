import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

import './index.css';
import AppRouter from './routes/AppRouter';

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
