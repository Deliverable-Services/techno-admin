import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css'
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './utils/queryClient';

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter></QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
