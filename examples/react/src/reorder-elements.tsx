import pino from 'pino';
import * as React from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import { ToolkitRenderer, Button, Tab, Tabs } from '@arcanejs/react-toolkit';

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
  port: 1334,
});

/**
 * Test app that explicitly reorders existing elements
 */
const App = () => {
  const [labels, setLabels] = React.useState(['foo', 'bar', 'baz']);

  return (
    <Tabs>
      {labels.map((label) => (
        <Tab name={label} key={label}>
          <Button
            text={'move to start'}
            onClick={() =>
              setLabels([label, ...labels.filter((l) => l !== label)])
            }
          />
        </Tab>
      ))}
    </Tabs>
  );
};

ToolkitRenderer.render(<App />, toolkit);
