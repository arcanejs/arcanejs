import * as http from 'http';
import { WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import type { ClientMessage, ServerMessage } from '@arcanejs/protocol';
import type { Logger } from '@arcanejs/protocol/logging';

import { LightDeskOptions } from './options.js';
import { FONTS } from '../shared/static.js';

// Get the module resolution custom conditions
const parentDir = path.basename(__dirname);

const DIST_DIR = (() => {
  switch (parentDir) {
    case 'backend':
      return path.resolve(__dirname, '../../dist');
    case 'dist':
      return __dirname;
    default:
      throw new Error(`Server running from unknown location: ${__dirname}`);
  }
})();

/**
 * Prepare all available static files at startup,
 * to avoid any risk of directory traversal attacks.
 */
type PreparedStaticFiles = {
  [id: string]: { path: string; contentType: string };
};

/**
 * Hard-code all available static files,
 * to avoid any risk of directory traversal attacks.
 */
const STATIC_FILES: PreparedStaticFiles = {
  [`/${FONTS.materialSymbolsOutlined}`]: {
    path: require.resolve('material-symbols/material-symbols-outlined.woff2'),
    contentType: 'font/woff2',
  },
};

export interface Connection {
  sendMessage(msg: ServerMessage): void;
}

export class Server {
  private readonly staticFiles: PreparedStaticFiles;
  private readonly entrypointFilename: string;

  public constructor(
    private readonly options: LightDeskOptions,
    private readonly onNewConnection: (connection: Connection) => void,
    private readonly onClosedConnection: (connection: Connection) => void,
    private readonly onMessage: (
      connection: Connection,
      message: ClientMessage,
    ) => void,
    private readonly log?: Logger,
  ) {
    const entrypoint =
      this.options.entrypointJsFile ??
      path.join(DIST_DIR, 'frontend', 'entrypoint.js');
    if (!entrypoint.endsWith('.js')) {
      throw new Error('Entrypoint file must be a .js file');
    }
    const entrypointMap = entrypoint + '.map';
    this.entrypointFilename = path.basename(entrypoint);

    this.staticFiles = {
      ...STATIC_FILES,
      [`/${this.entrypointFilename}`]: {
        path: entrypoint,
        contentType: 'text/javascript',
      },
      [`/${path.basename(entrypointMap)}`]: {
        path: entrypointMap,
        contentType: 'text/plain',
      },
    };

    log?.debug('Static Assets: %o', this.staticFiles);
  }

  public handleHttpRequest = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> => {
    this.log?.debug('handleHttpRequest %s', req.url);
    if (req.url === this.options.path) {
      const content = `
          <html>
            <head>
              <title>Light Desk</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <div id="root"></div>
              <script type="text/javascript" src="${this.options.path}${this.entrypointFilename}"></script>
            </body>
          </html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
      return;
    }
    if (req.url && req.url.startsWith(this.options.path)) {
      const relativePath = req.url.substr(this.options.path.length - 1);
      const f = this.staticFiles[relativePath];
      if (f) {
        return fs.promises.stat(f.path).then(
          () => {
            this.sendStaticFile(f.path, res, f.contentType);
          },
          (err) => {
            this.log?.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Expected static file not found', 'utf-8');
          },
        );
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found', 'utf-8');
  };

  private sendStaticFile = (
    file: string,
    response: http.ServerResponse,
    contentType: string,
  ) => {
    fs.readFile(file, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end('file not found', 'utf-8');
        } else {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Error', 'utf-8');
          this.log?.error(`Error reading static file: %s`, error);
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  };

  public handleWsConnection = <S extends WebSocket>(ws: S) => {
    const connection: Connection = {
      sendMessage: (msg) => ws.send(JSON.stringify(msg)),
    };
    this.onNewConnection(connection);
    this.log?.debug('new connection');
    ws.on('message', (msg) =>
      this.onMessage(connection, JSON.parse(msg.toString())),
    );
    ws.on('close', () => this.onClosedConnection(connection));
  };
}
