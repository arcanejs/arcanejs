import { createContext } from 'react';

import * as proto from '@arcanejs/protocol';

type StageContextData = {
  sendMessage: (<M extends proto.ClientMessage>(msg: M) => void) | null;
  renderComponent: (info: proto.AnyComponentProto) => JSX.Element;
  connectionUuid: string;
};

export const StageContext = createContext<StageContextData>(
  new Proxy({} as StageContextData, {
    get: () => {
      throw new Error('Missing StageContext.Provider');
    },
  }),
);
