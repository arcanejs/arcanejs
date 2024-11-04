import pino from 'pino';
import * as React from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import {
  ToolkitRenderer,
  Group,
  Button,
  Tabs,
  Tab,
  Switch,
  Rect,
  Label,
  TextInput,
} from '@arcanejs/react-toolkit';

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
  port: 1333,
});

const App = () => {
  const [switchState, setSwitchState] = React.useState<'off' | 'on'>('off');
  const [color, setColor] = React.useState('purple');
  const [textValue, setTextValue] = React.useState('initial text');

  return (
    <Tabs>
      <Tab name="FooBar">
        <Group>
          {`Switch State: ${switchState}`}
          <Switch
            state={switchState}
            onChange={(value) => setSwitchState(value)}
          />
          <Switch
            state={switchState === 'on' ? 'off' : 'on'}
            onChange={(value) => setSwitchState(value === 'on' ? 'off' : 'on')}
          />
        </Group>
      </Tab>
      <Tab name="Colors">
        <Group>
          <Rect color={color} />
          <Button text="red" onClick={() => setColor('red')} />
          <Button text="blue" onClick={() => setColor('blue')} />
          <Button
            text="translucent green"
            onClick={() => setColor('rgba(0, 255, 0, 0.5)')}
          />
        </Group>
      </Tab>
      <Tab name="Another">
        <Group>
          <Label text={textValue} />
          <TextInput value={textValue} onChange={setTextValue} />
        </Group>
      </Tab>
    </Tabs>
  );
};

ToolkitRenderer.render(<App />, toolkit);
