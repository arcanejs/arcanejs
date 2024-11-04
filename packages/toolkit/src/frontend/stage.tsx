import { patchJson } from '@arcanejs/diff';
import * as React from 'react';
import { styled, ThemeProvider } from 'styled-components';

import * as proto from '@arcanejs/protocol';
import {
  BaseStyle,
  GlobalStyle,
  THEME,
} from '@arcanejs/toolkit-frontend/styling';

import {
  Group,
  GroupStateWrapper,
  StageContext,
  renderStandardComponent,
} from '@arcanejs/toolkit-frontend';

import { MaterialFontStyle } from './styling';

type Props = {
  className?: string;
};

const Stage: React.FC<Props> = ({ className }) => {
  const [root, setRoot] = React.useState<proto.GroupComponent | undefined>(
    undefined,
  );
  const socket = React.useRef<Promise<WebSocket> | null>(null);

  React.useEffect(() => {
    initializeWebsocket();
  }, []);

  const initializeWebsocket = async () => {
    console.log('initializing websocket');
    const ws = new WebSocket(
      `ws://${window.location.hostname}:${window.location.port}${window.location.pathname}`,
    );
    ws.onmessage = (event) => {
      handleMessage(JSON.parse(event.data));
    };
    ws.onclose = () => {
      console.log('socket closed');
      socket.current = null;
    };
    socket.current = new Promise<WebSocket>((resolve, reject) => {
      ws.onopen = () => {
        resolve(ws);
      };
      ws.onerror = (err) => {
        reject(err);
        socket.current = null;
      };
    });
    return ws;
  };

  const sendMessage = async (msg: proto.ClientMessage) => {
    (await (socket.current || initializeWebsocket())).send(JSON.stringify(msg));
  };

  const handleMessage = (msg: proto.ServerMessage) => {
    switch (msg.type) {
      case 'tree-full':
        setRoot(msg.root);
        return;
      case 'tree-diff':
        setRoot((prevRoot) => patchJson(prevRoot, msg.diff));
        return;
    }
  };

  return (
    <StageContext.Provider
      value={{
        sendMessage,
        renderComponent: renderStandardComponent,
      }}
    >
      <GroupStateWrapper openByDefault={false}>
        <div className={className}>
          {root ? (
            <Group info={root} />
          ) : (
            <div className="no-root">
              No root has been added to the light desk
            </div>
          )}
        </div>
      </GroupStateWrapper>
    </StageContext.Provider>
  );
};

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
      <MaterialFontStyle />
      <ThemeProvider theme={THEME}>
        <StyledStage />
      </ThemeProvider>
    </>
  );
}
