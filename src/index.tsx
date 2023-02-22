import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './styles/reset.local.css';

const root = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);
