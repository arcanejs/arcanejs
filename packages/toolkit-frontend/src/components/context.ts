import { createContext } from 'react';

import * as proto from '@arcanejs/protocol';

export const StageContext = createContext<{
  sendMessage: (<M extends proto.ClientMessage>(msg: M) => void) | null;
  renderComponent: (info: proto.AnyComponentProto) => JSX.Element;
}>({
  sendMessage: null,
  renderComponent: () => {
    throw new Error(`missing root context`);
  },
});
