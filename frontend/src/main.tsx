import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store } from './store/store.ts';
import { Provider } from 'react-redux'; // Импортируем Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Оборачиваем App в Provider и передаем ему наше хранилище */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);