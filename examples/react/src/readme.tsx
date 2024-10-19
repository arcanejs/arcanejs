/*
 * This example script is the same as that included in the
  * README.md file for the @arcanejs/react-toolkit package.
 */
import { useState } from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { ToolkitRenderer, Group, Switch, SliderButton } from '@arcanejs/react-toolkit';

const toolkit = new Toolkit();

// Expose the toolkit control panel on HTTP port 3000
// Navigate to http://localhost:3000 to access the control panel
// this will be printed in your console
toolkit.start({
  mode: 'automatic',
  port: 3000,
});

const ControlPanel = () => {
  const [switchState, setSwitchState] = useState<'off' | 'on'>('off');
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Group direction='vertical'>
      <Group>
        {`Switch State: ${switchState}`}
        <Switch
            state={switchState}
            onChange={setSwitchState}
          />
      </Group>
      <Group>
        {`Slider Value: ${sliderValue}`}
        <SliderButton
          value={sliderValue}
          onChange={setSliderValue}
          min={0}
          max={100}
          />
      </Group>
    </Group>
  );
};

// Start rendering the control panel with @arcanejs/react-toolkit
ToolkitRenderer.render(<ControlPanel />, toolkit);
