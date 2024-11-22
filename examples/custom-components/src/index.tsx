import pino from 'pino';
import * as React from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import {
  Group,
  ToolkitRenderer,
  prepareComponents,
} from '@arcanejs/react-toolkit';
import { AnyComponent, Base } from '@arcanejs/toolkit/components/base';
import { IDMap } from '@arcanejs/toolkit/util';
import { CoreComponents } from '../../../packages/react-toolkit/src/core';

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

type StopwatchProto = {
  key: number;
  namespace: 'custom';
  component: 'stopwatch';
  foo: string;
};

class Stopwatch extends Base<'custom', StopwatchProto, { foo: string }> {
  public getProtoInfo(idMap: IDMap): StopwatchProto {
    return {
      namespace: 'custom',
      component: 'stopwatch',
      key: idMap.getId(this),
      foo: this.props.foo,
    };
  }
}

const C = prepareComponents('custom', {
  Stopwatch,
});

export type ComponentRegister = {
  [type: string]: {
    create: (props: { [key: string]: any }) => AnyComponent;
  };
};

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
    componentNamespaces: [CoreComponents, C],
  },
);
