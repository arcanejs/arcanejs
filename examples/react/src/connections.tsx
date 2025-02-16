import { useContext } from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { ToolkitRenderer, Group } from '@arcanejs/react-toolkit';
import pino from 'pino';
import {
  ConnectionsContext,
  ConnectionsContextProvider,
} from '@arcanejs/react-toolkit/connections';

const toolkit = new Toolkit({
  log: pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  }),
  title: '@arcanejs example',
});

toolkit.start({
  mode: 'automatic',
  port: 1339,
});

const ColorPicker = () => {
  const { connections } = useContext(ConnectionsContext);

  return (
    <Group direction="vertical">
      {connections.map(({ uuid }) => (
        <Group key={uuid} title={uuid} />
      ))}
    </Group>
  );
};

ToolkitRenderer.render(
  <ConnectionsContextProvider toolkit={toolkit}>
    <ColorPicker />
  </ConnectionsContextProvider>,

  toolkit,
);
