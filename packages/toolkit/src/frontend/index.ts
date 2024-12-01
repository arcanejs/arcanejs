import { createRoot } from 'react-dom/client';

import { initialiseListeners } from '@arcanejs/toolkit-frontend/util';

import { rootComponent } from './stage';
import { FrontendComponentRenderers } from '@arcanejs/toolkit-frontend/types';

export type ArcaneFrontendOptions = {
  renderers: FrontendComponentRenderers;
};

export const startArcaneFrontend = (opts: ArcaneFrontendOptions) => {
  initialiseListeners();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  const root = createRoot(rootElement);
  root.render(rootComponent(opts));
};
