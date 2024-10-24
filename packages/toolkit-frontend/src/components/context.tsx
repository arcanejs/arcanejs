import { createContext } from 'react';

import * as proto from '@arcanejs/protocol';

export const StageContext = createContext<{
  sendMessage: ((msg: proto.ClientMessage) => void) | null;
  renderComponent: (info: proto.Component) => JSX.Element;
}>({
  sendMessage: null,
  renderComponent: () => {
    throw new Error(`missing root context`);
  },
});
