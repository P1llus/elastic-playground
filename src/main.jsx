import React from 'react';
import ReactDOM from 'react-dom';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import App from './App.jsx';

ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="dark">
      <App />
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
