import { createRoot } from 'react-dom/client';

import { rootComponent } from './stage';
import { initialiseListeners } from './util/touch';

initialiseListeners();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(rootComponent());

console.log('aaah');
