"use client";

import dynamic from 'next/dynamic'
import { useState } from 'react';
import { Group, SliderButton } from '@arcanejs/react-toolkit';

import {
  ToolkitDisplay,
  ToolkitSimulatorProvider,
} from './simulator';

const ExampleComponent = () => {
  "use client";

  const [value, setValue] = useState(0);

  return (
    <Group title="This uses react render">
      {/* Foo
      <SliderButton value={value} min={0} max={100} step={1} onChange={setValue}/>
      Bar
      <SliderButton value={value} min={0} max={100} step={1} onChange={setValue}/> */}
    </Group>
  )

  // return (
  //   <>Foo</>
  // )
};

const SimulatorExample = () => {
  return (
    <ToolkitSimulatorProvider root={<ExampleComponent/>}>
      <h2>Toolkit A</h2>
      <ToolkitDisplay />
      <h2>Toolkit B</h2>
      <ToolkitDisplay />
    </ToolkitSimulatorProvider>
  );
}

export const SimulatorExampleDynamic = dynamic(() => Promise.resolve(SimulatorExample), {
  ssr: false
});
