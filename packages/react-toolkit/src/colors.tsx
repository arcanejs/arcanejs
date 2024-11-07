import React, { useCallback } from 'react';
import { HUE_GRADIENT } from '@arcanejs/toolkit/util';

import { Group, Rect, SliderButton } from './components';
import { LightDeskIntrinsicElements } from './types';

export type HslColor = {
  /**
   * Hue in degrees, between 0-360.
   */
  hue: number;
  /**
   * Percentage saturation, between 0-100.
   */
  saturation: number;
  /**
   * Percentage lightness, between 0-100.
   */
  lightness: number;
  /**
   * Alpha channel, between 0-1.
   */
  alpha?: number;
};

export type HslColorPickerProps = {
  color: HslColor;
  onChange: (update: (current: HslColor) => HslColor) => void;
  /**
   * Should the alpha channel be shown?
   *
   * @default false
   */
  showAlpha?: boolean;
  /**
   * Props to pass to the group component.
   *
   * @see {@link DEFAULT_GROUP_PROPS}
   */
  groupProps?: LightDeskIntrinsicElements['group'];
};

/**
 * The default values given to the group component for the color picker.
 */
const DEFAULT_GROUP_PROPS: LightDeskIntrinsicElements['group'] = {
  wrap: true,
  direction: 'horizontal',
};

export const HslColorPicker: React.FC<HslColorPickerProps> = ({
  color,
  onChange,
  showAlpha = false,
  groupProps,
}) => {
  const { hue, saturation, lightness, alpha = 1 } = color;

  const setHue = useCallback(
    (newHue: number) => {
      onChange((current) => ({
        ...current,
        hue: newHue,
      }));
    },
    [onChange],
  );

  const setSat = useCallback(
    (newSat: number) => {
      onChange((current) => ({
        ...current,
        saturation: newSat,
      }));
    },
    [onChange],
  );

  const setLightness = useCallback(
    (newLightness: number) => {
      onChange((current) => ({
        ...current,
        lightness: newLightness,
      }));
    },
    [onChange],
  );

  const setAlpha = useCallback(
    (newAlpha: number) => {
      onChange((current) => ({
        ...current,
        alpha: newAlpha,
      }));
    },
    [onChange],
  );

  return (
    <Group {...DEFAULT_GROUP_PROPS} {...groupProps}>
      <Rect color={`hsl(${hue}deg ${saturation}% ${lightness}% / ${alpha})`} />
      <SliderButton
        value={hue}
        onChange={setHue}
        min={0}
        max={360}
        step={1}
        gradient={HUE_GRADIENT}
        grow
      />
      <SliderButton
        value={saturation}
        onChange={setSat}
        min={0}
        max={100}
        step={1}
        gradient={[
          { color: `hsl(${hue}deg 0% ${lightness}%)`, position: 0 },
          { color: `hsl(${hue}deg 50% ${lightness}%)`, position: 0.5 },
          { color: `hsl(${hue}deg 100% ${lightness}%)`, position: 1 },
        ]}
        grow
      />
      <SliderButton
        value={lightness}
        onChange={setLightness}
        min={0}
        max={100}
        step={1}
        gradient={[
          { color: `hsl(${hue}deg ${saturation}% 0%)`, position: 0 },
          { color: `hsl(${hue}deg ${saturation}% 50%)`, position: 0.5 },
          { color: `hsl(${hue}deg ${saturation}% 100%)`, position: 1 },
        ]}
        grow
      />
      {showAlpha && (
        <SliderButton
          value={alpha}
          onChange={setAlpha}
          min={0}
          max={1}
          step={0.01}
          gradient={[
            {
              color: `hsla(${hue}deg ${saturation}% ${lightness}% / 0)`,
              position: 0,
            },
            {
              color: `hsla(${hue}deg ${saturation}% ${lightness}% / 1)`,
              position: 1,
            },
          ]}
          grow
        />
      )}
    </Group>
  );
};
