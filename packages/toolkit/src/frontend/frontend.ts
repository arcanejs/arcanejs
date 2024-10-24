import { createRoot } from 'react-dom/client';

import { initialiseListeners } from '@arcanejs/toolkit-frontend/util';

import { rootComponent } from './stage';

initialiseListeners();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(rootComponent());
