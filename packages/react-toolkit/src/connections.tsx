import type { Toolkit, ToolkitConnection } from '@arcanejs/toolkit';
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type ConnectionsContextData = {
  connections: ToolkitConnection[];
};

export const ConnectionsContext = createContext<ConnectionsContextData>(
  new Proxy({} as ConnectionsContextData, {
    get: () => {
      throw new Error(
        'Can\t use ConnectionsContext without ConnectionsContextProvider',
      );
    },
  }),
);

type ConnectionsContextProviderProps = {
  toolkit: Toolkit;
  children: ReactNode;
};

export const ConnectionsContextProvider: FC<
  ConnectionsContextProviderProps
> = ({ toolkit, children }) => {
  const [connections, setConnections] = useState<ToolkitConnection[]>([]);

  useEffect(() => {
    const onNewConnection = (connection: ToolkitConnection) => {
      setConnections((current) => [...current, connection]);
    };

    const onClosedConnection = (connection: ToolkitConnection) => {
      setConnections((current) => current.filter((c) => c !== connection));
    };

    toolkit.addListener('new-connection', onNewConnection);
    toolkit.addListener('closed-connection', onClosedConnection);

    setConnections(toolkit.getConnections());

    return () => {
      toolkit.removeListener('new-connection', onNewConnection);
      toolkit.removeListener('closed-connection', onClosedConnection);
    };
  }, [toolkit]);

  return (
    <ConnectionsContext.Provider value={{ connections }}>
      {children}
    </ConnectionsContext.Provider>
  );
};
