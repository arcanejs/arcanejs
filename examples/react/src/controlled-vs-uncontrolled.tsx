import { FC, useCallback, useRef, useState } from 'react';
import {
  Toolkit,
  Switch as SwitchComponent,
  SliderButton as SliderButtonComponent,
} from '@arcanejs/toolkit';
import {
  ToolkitRenderer,
  Group,
  Switch,
  SliderButton,
  Button,
} from '@arcanejs/react-toolkit';
import pino from 'pino';

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
  port: 1337,
});

type Props = {
  initialSwitchState: 'off' | 'on';
  initialSliderValue: number;
};

const ControlledInputs: FC<Props> = ({
  initialSliderValue,
  initialSwitchState,
}) => {
  const [switchState, setSwitchState] = useState<'off' | 'on'>(
    initialSwitchState,
  );
  const [sliderValue, setSliderValue] = useState(initialSliderValue);

  const resetValues = useCallback(() => {
    setSwitchState(initialSwitchState);
    setSliderValue(initialSliderValue);
  }, [initialSliderValue, initialSwitchState]);

  return (
    <Group direction="vertical" title="Controlled Inputs">
      <Button text="Reset Values to Default" onClick={resetValues} />
      <Group>
        {`Switch State: ${switchState}`}
        <Switch
          value={switchState}
          onChange={(value) =>
            void setTimeout(() => setSwitchState(value), 1000)
          }
        />
      </Group>
      <Group>
        {`Slider Value: ${sliderValue}`}
        <SliderButton
          value={sliderValue}
          onChange={(value) =>
            void setTimeout(() => setSliderValue(value), 1000)
          }
          min={0}
          max={100}
        />
      </Group>
    </Group>
  );
};

const UncontrolledInputs: FC<Props> = ({
  initialSliderValue,
  initialSwitchState,
}) => {
  const [switchState, setSwitchState] = useState<'off' | 'on'>(
    initialSwitchState,
  );
  const [sliderValue, setSliderValue] = useState(initialSliderValue);

  const switchRef = useRef<SwitchComponent | null>(null);
  const sliderRef = useRef<SliderButtonComponent | null>(null);

  const resetValues = useCallback(() => {
    setSwitchState(initialSwitchState);
    setSliderValue(initialSliderValue);
    // Need to also manually update the state of the uncontrolled components
    switchRef.current?.setValue(initialSwitchState);
    sliderRef.current?.setValue(initialSliderValue);
  }, [initialSliderValue, initialSwitchState]);

  return (
    <Group direction="vertical" title="Controlled Inputs">
      <Button text="Reset Values to Default" onClick={resetValues} />
      <Group>
        {`Switch State: ${switchState}`}
        <Switch
          ref={switchRef}
          defaultValue={switchState}
          onChange={(value) =>
            void setTimeout(() => setSwitchState(value), 1000)
          }
        />
      </Group>
      <Group>
        {`Slider Value: ${sliderValue}`}
        <SliderButton
          ref={sliderRef}
          defaultValue={sliderValue}
          onChange={(value) =>
            void setTimeout(() => setSliderValue(value), 1000)
          }
          min={0}
          max={100}
        />
      </Group>
    </Group>
  );
};

const ControlPanel = () => {
  return (
    <>
      <ControlledInputs initialSwitchState="on" initialSliderValue={30} />
      <ControlledInputs initialSwitchState="off" initialSliderValue={70} />
      <UncontrolledInputs initialSwitchState="on" initialSliderValue={30} />
      <UncontrolledInputs initialSwitchState="off" initialSliderValue={70} />
    </>
  );
};

// Start rendering the control panel with @arcanejs/react-toolkit
ToolkitRenderer.render(<ControlPanel />, toolkit);
