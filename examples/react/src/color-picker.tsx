import { useState } from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { ToolkitRenderer, Group } from '@arcanejs/react-toolkit';
import { HslColor, HslColorPicker } from '@arcanejs/react-toolkit/colors';
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
  port: 1338,
});

const ColorPicker = () => {
  const [color, setColor] = useState<HslColor>({
    hue: 0,
    saturation: 100,
    lightness: 50,
    alpha: 1,
  });

  return (
    <Group direction="vertical">
      <HslColorPicker color={color} onChange={setColor} showAlpha />
      <HslColorPicker
        color={color}
        onChange={setColor}
        groupProps={{
          border: true,
          direction: 'vertical',
        }}
      />
    </Group>
  );
};

ToolkitRenderer.render(<ColorPicker />, toolkit);
