import { useState } from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { HUE_GRADIENT } from '@arcanejs/toolkit/util';
import {
  ToolkitRenderer,
  Group,
  SliderButton,
  Rect,
} from '@arcanejs/react-toolkit';
import pino from 'pino';

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
  port: 1338,
});

const ColorPicker = () => {
  const [alpha, setAlpha] = useState(1);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [lightness, setLightness] = useState(50);

  return (
    <Group direction="vertical">
      <Rect color={`hsl(${hue}deg ${sat}% ${lightness}% / ${alpha})`} />
      <SliderButton
        value={hue}
        onChange={setHue}
        min={0}
        max={360}
        step={1}
        gradient={HUE_GRADIENT}
      />
      <SliderButton
        value={sat}
        onChange={setSat}
        min={0}
        max={100}
        step={1}
        gradient={[
          { color: `hsl(${hue}deg 0% ${lightness}%)`, position: 0 },
          { color: `hsl(${hue}deg 50% ${lightness}%)`, position: 0.5 },
          { color: `hsl(${hue}deg 100% ${lightness}%)`, position: 1 },
        ]}
      />
      <SliderButton
        value={lightness}
        onChange={setLightness}
        min={0}
        max={100}
        step={1}
        gradient={[
          { color: `hsl(${hue}deg ${sat}% 0%)`, position: 0 },
          { color: `hsl(${hue}deg ${sat}% 50%)`, position: 0.5 },
          { color: `hsl(${hue}deg ${sat}% 100%)`, position: 1 },
        ]}
      />
      <SliderButton
        value={alpha}
        onChange={setAlpha}
        min={0}
        max={1}
        step={0.01}
        gradient={[
          { color: `hsla(${hue}deg ${sat}% ${lightness}% / 0)`, position: 0 },
          { color: `hsla(${hue}deg ${sat}% ${lightness}% / 1)`, position: 1 },
        ]}
      />
    </Group>
  );
};

ToolkitRenderer.render(<ColorPicker />, toolkit);
