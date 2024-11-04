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
  port: 1330,
});

const TestComponent = ({ foo }: { foo: string }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [count]);

  return <Group title={`asd: ${count}`}>{`${foo}: ${count}`}</Group>;
};

const App = () => (
  <Group title="Counter" direction="vertical">
    <TestComponent foo="a" />
    <Group defaultCollapsibleState="open">
      <TestComponent foo="b" />
    </Group>
  </Group>
);

ToolkitRenderer.render(<App />, toolkit);
