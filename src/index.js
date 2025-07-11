
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DarkModeToggle from "./components/DarkModeToggle";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <DarkModeToggle />
  </React.StrictMode>
);

