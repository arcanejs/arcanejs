import * as React from 'react';
import { styled, ThemeProvider } from 'styled-components';
import { BaseStyle, GlobalStyle, THEME } from './styling';

import * as proto from '../shared/proto';

import { Group, GroupStateWrapper } from './components/group';
import { StageContext } from './components/context';
import { patchJson } from '@arcanejs/diff';

type Props = {
  className?: string;
};

type State = {
  root: proto.GroupComponent | undefined;
  sendMessage: ((msg: proto.ClientMessage) => void) | null;
};

const renderComponent = (info: proto.Component): JSX.Element => {
  switch (info.component) {
    case 'group':
      return <Group key={info.key} info={info} />;
    case 'group-header':
      throw new Error(
        `Cannot render ${info.component} outside of expected parents`,
      );
  }
};

class Stage extends React.Component<Props, State> {
  private socket: Promise<WebSocket> | null = null;

  public constructor(props: Props) {
    super(props);
    this.state = {
      root: undefined,
      sendMessage: null,
    };
  }

  public componentDidMount() {
    console.log('mounted');
    this.initializeWebsocket();
    this.setState({ sendMessage: this.sendMessage });
  }

  private initializeWebsocket = async () => {
    console.log('initializing websocket');
    const socket = new WebSocket(
      `ws://${window.location.hostname}:${window.location.port}${window.location.pathname}`,
    );
    socket.onmessage = (event) => {
      console.log('message', event.data);
      this.handleMessage(JSON.parse(event.data));
    };
    socket.onclose = () => {
      console.log('socket closed');
      this.socket = null;
    };
    this.socket = new Promise<WebSocket>((resolve, reject) => {
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (err) => {
        reject(err);
        this.socket = null;
      };
    });
    return socket;
  };

  private sendMessage = async (msg: proto.ClientMessage) => {
    (await (this.socket || this.initializeWebsocket())).send(
      JSON.stringify(msg),
    );
  };

  private handleMessage(msg: proto.ServerMessage) {
    console.log('handleMessage', msg);
    switch (msg.type) {
      case 'tree-full':
        this.setState({ root: msg.root });
        return;
      case 'tree-diff':
        this.setState((state) => ({
          root: patchJson(state.root, msg.diff),
        }));
        return;
    }
  }

  public render() {
    return (
      <StageContext.Provider
        value={{
          sendMessage: this.state.sendMessage,
          renderComponent,
        }}
      >
        <GroupStateWrapper openByDefault={false}>
          <div className={this.props.className}>
            {this.state.root ? (
              <Group info={this.state.root} />
            ) : (
              <div className="no-root">
                No root has been added to the light desk
              </div>
            )}
          </div>
        </GroupStateWrapper>
      </StageContext.Provider>
    );
  }
}

const StyledStage = styled(Stage)`
  width: 100%;
  height: 100%;
  background-color: #333;
  color: ${THEME.textNormal};
  padding: ${THEME.sizingPx.spacing}px;
`;

export function rootComponent() {
  return (
    <>
      <BaseStyle />
      <GlobalStyle />
      <ThemeProvider theme={THEME}>
        <StyledStage />
      </ThemeProvider>
    </>
  );
}
