import React from 'react';
import { createRoot } from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '@iconify-icon/react';

import App from './App';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);