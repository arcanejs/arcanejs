import type {
  Events as GroupEvents,
  Props as GroupProps,
} from '@arcanejs/toolkit/components/group';
import type {
  Events as ButtonEvents,
  Props as ButtonProps,
} from '@arcanejs/toolkit/components/button';
import type { Props as LabelProps } from '@arcanejs/toolkit/components/label';
import type { Props as RectProps } from '@arcanejs/toolkit/components/rect';
import type {
  Events as SliderButtonEvents,
  Props as SliderButtonProps,
} from '@arcanejs/toolkit/components/slider-button';
import type {
  Events as SwitchEvents,
  Props as SwitchProps,
} from '@arcanejs/toolkit/components/switch';
import type { TabProps, TabsProps } from '@arcanejs/toolkit/components/tabs';
import type {
  Events as TextInputEvents,
  Props as TextInputProps,
} from '@arcanejs/toolkit/components/text-input';
import type { Props as TimelineProps } from '@arcanejs/toolkit/components/timeline';

type Children = JSX.Element | string | (string | JSX.Element)[];

export interface LightDeskIntrinsicElements {
  button: ButtonProps & {
    children?: never;
    onClick?: ButtonEvents['click'];
  };
  group: GroupProps & {
    children?: Children;
    onTitleChanged?: GroupEvents['title-changed'];
  };
  'group-header': {
    children?: Children;
  };
  label: LabelProps & {
    children?: never;
  };
  rect: RectProps & {
    children?: never;
  };
  'slider-button': SliderButtonProps & {
    children?: never;
    onChange?: SliderButtonEvents['change'];
  };
  switch: SwitchProps & {
    children?: never;
    onChange?: SwitchEvents['change'];
  };
  tab: TabProps & {
    children?: JSX.Element | string;
  };
  tabs: TabsProps & {
    children?: JSX.Element | JSX.Element[];
  };
  'text-input': TextInputProps & {
    children?: JSX.Element | JSX.Element[];
    onChange?: TextInputEvents['change'];
  };
  timeline: TimelineProps & {
    children?: never;
  };
}
