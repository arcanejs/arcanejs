import _ from 'lodash';
import { diffJson } from '@arcanejs/diff/diff';
import {
  DEFAULT_LIGHT_DESK_OPTIONS,
  InitializationOptions,
  LightDeskOptions,
} from './options';
import { Connection, Server } from './server';
import { IDMap } from './util/id-map';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Group } from './components/group';
import { Component } from './components/base';
import { ClientMessage } from '../shared/proto';

console.log(diffJson);

export class Toolkit {
  private readonly options: LightDeskOptions;
  /**
   * Mapping from components to unique IDs that identify them
   */
  private readonly componentIDMap = new IDMap();
  private readonly connections = new Set<Connection>();
  private rootGroup: Group | null = null;

  constructor(options: Partial<LightDeskOptions> = {}) {
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

  public start = (opts: InitializationOptions) => {
    const server = new Server(
      this.options,
      this.onNewConnection,
      this.onClosedConnection,
      this.onMessage,
    );
    if (opts.mode === 'automatic') {
      const httpServer = createServer(server.handleHttpRequest);
      const wss = new WebSocketServer({
        server: httpServer,
      });
      wss.on('connection', server.handleWsConnection);

      httpServer.listen(opts.port, () => {
        console.log(
          `Light Desk Started: http://localhost:${opts.port}${this.options.path}`,
        );
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

  public updateTree = _.throttle(
    () => {
      setImmediate(() => {
        if (!this.rootGroup) return;
        const root = this.rootGroup.getProtoInfo(this.componentIDMap);
        for (const connection of this.connections) {
          connection.sendMessage({ type: 'update_tree', root });
        }
      });
    },
    10,
    { leading: true, trailing: true },
  );

  public removeChild = (component: Component) => {
    if (this.rootGroup === component) {
      this.rootGroup = null;
      component.setParent(null);
      // TODO: update tree with empty tree
    }
  };

  private onNewConnection = (connection: Connection) => {
    this.connections.add(connection);
    if (this.rootGroup) {
      connection.sendMessage({
        type: 'update_tree',
        root: this.rootGroup.getProtoInfo(this.componentIDMap),
      });
    }
  };

  private onClosedConnection = (connection: Connection) => {
    console.log('removing connection');
    this.connections.delete(connection);
  };

  private onMessage = (_connection: Connection, message: ClientMessage) => {
    console.log('got message', message);
    switch (message.type) {
      case 'component_message':
        if (this.rootGroup)
          this.rootGroup.routeMessage(this.componentIDMap, message);
        break;
    }
  };
}
