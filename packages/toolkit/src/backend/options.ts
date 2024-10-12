import type * as http from 'http';

import type { Application } from 'express';
import { Server } from './server';

export interface LightDeskOptions {
  /**
   * What path should be used to serve the light desk.
   *
   * This is important if a express server will be used that serves other paths.
   */
  path: string;
}

export const DEFAULT_LIGHT_DESK_OPTIONS: LightDeskOptions = {
  path: '/',
};

export type InitializationOptions =
  /** automatically start a simple  */
  | { mode: 'automatic'; port: number }
  /** Create a websocket server that attaches to an existing express and http server */
  | { mode: 'express'; express: Application; server: http.Server }
  /** Create a websocket server that attaches to an existing express and http server */
  | { mode: 'manual'; setup: (server: Server) => void };
