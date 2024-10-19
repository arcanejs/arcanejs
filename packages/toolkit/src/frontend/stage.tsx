import { patchJson } from '@arcanejs/diff';
import * as React from 'react';
import { styled, ThemeProvider } from 'styled-components';

import * as proto from '../shared/proto';

import { BaseStyle, GlobalStyle, THEME } from './styling';
import { Group, GroupStateWrapper } from './components/group';
import { StageContext } from './components/context';
import { Button } from './components/button';
import { Label } from './components/label';
import { Rect } from './components/rect';
import { SliderButton } from './components/slider_button';
import { Switch } from './components/switch';

type Props = {
  className?: string;
};

const renderComponent = (info: proto.Component): JSX.Element => {
  switch (info.component) {
    case 'button':
      return <Button key={info.key} info={info} />;
    case 'group':
      return <Group key={info.key} info={info} />;
    case 'group-header':
      throw new Error(
        `Cannot render ${info.component} outside of expected parents`,
      );
    case 'label':
      return <Label key={info.key} info={info} />;
    case 'rect':
      return <Rect key={info.key} info={info} />;
    case 'slider_button':
      return <SliderButton key={info.key} info={info} />;
    case 'switch':
      return <Switch key={info.key} info={info} />;
  }
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
      console.log('message', event.data);
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
    console.log('handleMessage', msg);
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
        renderComponent,
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
      <ThemeProvider theme={THEME}>
        <StyledStage />
      </ThemeProvider>
    </>
  );
}
