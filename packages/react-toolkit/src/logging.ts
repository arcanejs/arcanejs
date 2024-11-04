import { Logger } from '@arcanejs/protocol/logging';
import { createContext, useContext } from 'react';

export const LoggerContext = createContext<() => Logger | null>(() => {
  throw new Error('LoggerContext not provided');
});

export const useLogger = () => {
  return useContext(LoggerContext)();
};
