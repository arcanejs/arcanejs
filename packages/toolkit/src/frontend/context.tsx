import { createContext } from 'react';

export type CoreContextData = {
  uuid: string | null;
};

export const CoreContext = createContext<CoreContextData>(
  new Proxy({} as CoreContextData, {
    get: () => {
      throw new Error('Missing CoreContext Context');
    },
  }),
);
