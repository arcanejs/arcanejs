import _ from 'lodash';
import { diffJson } from '@arcanejs/diff/diff';
import {
  DEFAULT_LIGHT_DESK_OPTIONS,
  InitializationOptions,
  ToolkitOptions,
} from './options';
import { Connection, Server } from './server';
import { IDMap } from './util/id-map';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Group } from './components/group';
import {
  AnyComponent,
  EventEmitter,
  Listenable,
  Parent,
} from './components/base';
import { ClientMessage, AnyComponentProto } from '@arcanejs/protocol';

export type ToolkitConnection = {
  uuid: string;
};

type ConnectionMetadata = {
  /**
   * The publicly-exposed connection object that can be shared throughout
   * the library, and externally.
   */
  publicConnection: ToolkitConnection;
  lastTreeSent: AnyComponentProto | undefined;
};

export type Events = {
  'new-connection': (connection: ToolkitConnection) => void;
  'closed-connection': (connection: ToolkitConnection) => void;
};

export class Toolkit implements Parent, Listenable<Events> {
  private readonly options: ToolkitOptions;
  /**
   * Mapping from components to unique IDs that identify them
   */
  private readonly componentIDMap = new IDMap();
  private readonly connections = new Map<Connection, ConnectionMetadata>();
  private rootGroup: Group | null = null;

  /** @hidden */
  private readonly events = new EventEmitter<Events>();

  constructor(options: Partial<ToolkitOptions> = {}) {
    this.options = {
      ...DEFAULT_LIGHT_DESK_OPTIONS,
      ...options,
    };
    if (
      !this.options.path.endsWith('/') ||
      !this.options.path.startsWith('/')
    ) {
      throw new Error(
        `path must start and end with "/", set to: ${this.options.path}`,
      );
    }
  }

  public addListener = this.events.addListener;
  public removeListener = this.events.removeListener;

  public start = (opts: InitializationOptions) => {
    const server = new Server(
      this.options,
      this.onNewConnection,
      this.onClosedConnection,
      this.onMessage,
      this.options.log,
    );
    if (opts.mode === 'automatic') {
      const httpServer = createServer(server.handleHttpRequest);
      const wss = new WebSocketServer({
        server: httpServer,
      });
      wss.on('connection', server.handleWsConnection);
      const url = `http://localhost:${opts.port}${this.options.path}`;
      httpServer.listen(opts.port, () => {
        opts.onReady?.(url);
        this.options.log?.info(`Light Desk Started: ${url}`);
      });
    } else if (opts.mode === 'express') {
      const wss = new WebSocketServer({
        server: opts.server,
      });
      wss.on('connection', server.handleWsConnection);
      opts.express.get(`${this.options.path}*`, server.handleHttpRequest);
    } else if (opts.mode === 'manual') {
      opts.setup(server);
    } else {
      throw new Error(`Unsupported mode`);
    }
  };

  public setRoot = (group: Group) => {
    if (this.rootGroup) {
      // TODO
      throw new Error('Can only set root group once');
    }
    this.rootGroup = group;
    this.rootGroup.setParent(this);
  };

  public log() {
    return this.options.log ?? null;
  }

  public getConnections = (): ToolkitConnection[] => {
    return [...this.connections.values()].map((c) => c.publicConnection);
  };

  public updateTree = _.throttle(
    () => {
      setImmediate(() => {
        if (!this.rootGroup) return;
        const root = this.rootGroup.getProtoInfo(this.componentIDMap);
        for (const [connection, meta] of this.connections.entries()) {
          connection.sendMessage({
            type: 'tree-diff',
            diff: diffJson(meta.lastTreeSent, root),
          });
          meta.lastTreeSent = root;
        }
      });
    },
    10,
    { leading: true, trailing: true },
  );

  public removeChild = (component: AnyComponent) => {
    if (this.rootGroup === component) {
      this.rootGroup = null;
      component.setParent(null);
      // TODO: update tree with empty tree
    }
  };

  private onNewConnection = (connection: Connection) => {
    const lastTreeSent =
      this.rootGroup?.getProtoInfo(this.componentIDMap) ?? undefined;
    const uuid = uuidv4();
    const publicConnection: ToolkitConnection = {
      get uuid() {
        return uuid;
      },
    };
    this.connections.set(connection, { publicConnection, lastTreeSent });
    this.events.emit('new-connection', publicConnection);
    if (lastTreeSent) {
      connection.sendMessage({
        type: 'tree-full',
        root: lastTreeSent,
      });
    }
  };

  private onClosedConnection = (connection: Connection) => {
    this.options.log?.debug('removing connection');
    const con = this.connections.get(connection);
    this.connections.delete(connection);
    if (con) {
      this.events.emit('closed-connection', con.publicConnection);
    }
  };

  private onMessage = (connection: Connection, message: ClientMessage) => {
    this.options.log?.debug('got message: %o', message);
    switch (message.type) {
      case 'component-message':
        if (this.rootGroup)
          this.rootGroup.routeMessage(this.componentIDMap, message);
        break;
    }
  };
}
