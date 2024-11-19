import pino from 'pino';
import * as React from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { prepareCustomComponents } from '@arcanejs/react-toolkit/custom';

import { ToolkitRenderer, Group } from '@arcanejs/react-toolkit';
import { CustomComponent } from '@arcanejs/toolkit/components/base';

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

class Stopwatch extends CustomComponent<{ foo: string }, { foo: string }> {
  public getProtoData = () => {
    return {
      foo: this.props.foo,
    };
  };
}

const C = prepareCustomComponents({
  Stopwatch,
});

const App = () => {
  const customRef = React.useRef<Stopwatch>(null);

  React.useEffect(() => {
    setTimeout(() => {
      console.log('CustomComponent', customRef.current);
    }, 500);
  }, [customRef]);

  return (
    <Group>
      <C.Stopwatch foo="bar" ref={customRef} />
    </Group>
  );
};

ToolkitRenderer.render(
  <App />,
  toolkit,
  {},
  {
    customComponents: C,
  },
);
