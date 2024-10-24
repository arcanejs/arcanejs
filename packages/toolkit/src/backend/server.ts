import * as http from 'http';
import { WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { ClientMessage, ServerMessage } from '@arcanejs/protocol';

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
 * Hard-code all available static files,
 * to avoid any risk of directory traversal attacks.
 */
const STATIC_FILES: { [id: string]: { path: string; contentType: string } } = {
  '/frontend.js': {
    path: path.join(DIST_DIR, 'frontend.js'),
    contentType: 'text/javascript',
  },
  '/frontend.js.map': {
    path: path.join(DIST_DIR, 'frontend.js.map'),
    contentType: 'text/plain',
  },
  [`/${FONTS.materialSymbolsOutlined}`]: {
    path: require.resolve('material-symbols/material-symbols-outlined.woff2'),
    contentType: 'font/woff2',
  },
};

console.log('STATIC_FILES', STATIC_FILES);

export interface Connection {
  sendMessage(msg: ServerMessage): void;
}

export class Server {
  public constructor(
    private readonly options: LightDeskOptions,
    private readonly onNewConnection: (connection: Connection) => void,
    private readonly onClosedConnection: (connection: Connection) => void,
    private readonly onMessage: (
      connection: Connection,
      message: ClientMessage,
    ) => void,
  ) {}

  public handleHttpRequest = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> => {
    console.log('handleHttpRequest', req.url);
    if (req.url === this.options.path) {
      const content = `
          <html>
            <head>
              <title>Light Desk</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <div id="root"></div>
              <script type="text/javascript" src="${this.options.path}frontend.js"></script>
            </body>
          </html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
      return;
    }
    if (req.url && req.url.startsWith(this.options.path)) {
      const relativePath = req.url.substr(this.options.path.length - 1);
      const f = STATIC_FILES[relativePath];
      if (f) {
        return fs.promises.stat(f.path).then(
          () => {
            this.sendStaticFile(f.path, res, f.contentType);
          },
          (err) => {
            console.error(err);
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
    fs.readFile(file, function (error, content) {
      if (error) {
        if (error.code === 'ENOENT') {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end('file not found', 'utf-8');
        } else {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Error', 'utf-8');
          console.error(error);
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
    console.log('new connection');
    ws.on('message', (msg) =>
      this.onMessage(connection, JSON.parse(msg.toString())),
    );
    ws.on('close', () => this.onClosedConnection(connection));
  };
}
