import React from 'react'
import ReactDOM from 'react-dom/client'

// Self-hosted fonts: guarantees exact font rendering on production & intranet without external CDN dependencies or CSP issues
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';

import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';

import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';

import { MainApp } from './components/MainApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
)
