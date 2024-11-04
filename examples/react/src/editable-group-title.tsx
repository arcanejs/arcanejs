import pino from 'pino';
import * as React from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import { ToolkitRenderer, Group } from '@arcanejs/react-toolkit';

const toolkit = new Toolkit({
  log: pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  }),
});

toolkit.start({
  mode: 'automatic',
  port: 1331,
});

const App = () => {
  const [title, setTitle] = React.useState('initial-group');

  return (
    <Group title={title} editableTitle={true} onTitleChanged={setTitle}>
      {`Label: ${title}`}
    </Group>
  );
};

ToolkitRenderer.render(<App />, toolkit);
