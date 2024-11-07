import { Gradient } from '@arcanejs/protocol';

/**
 * Rainbow gradient used for hue slider values.
 */
export const HUE_GRADIENT: Gradient = [
  { color: 'red', position: 0 },
  { color: 'yellow', position: 60 / 360 },
  { color: 'green', position: 120 / 360 },
  { color: 'cyan', position: 180 / 360 },
  { color: 'blue', position: 240 / 360 },
  { color: 'magenta', position: 300 / 360 },
  { color: 'red', position: 1 },
];
