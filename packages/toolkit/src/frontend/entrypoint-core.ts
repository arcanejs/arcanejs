import { createRoot } from 'react-dom/client';

import { initialiseListeners } from '@arcanejs/toolkit-frontend/util';

import { rootComponent } from './stage';
import { CORE_FRONTEND_COMPONENT_RENDERER } from '@arcanejs/toolkit-frontend';

initialiseListeners();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(
  rootComponent({
    renderers: [CORE_FRONTEND_COMPONENT_RENDERER],
  }),
);
