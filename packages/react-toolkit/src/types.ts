import type {
  Events as GroupEvents,
  Props as GroupProps,
  Group,
  GroupHeader,
} from '@arcanejs/toolkit/components/group';
import type {
  Events as ButtonEvents,
  Props as ButtonProps,
  Button,
} from '@arcanejs/toolkit/components/button';
import type {
  Props as LabelProps,
  Label,
} from '@arcanejs/toolkit/components/label';
import type {
  Props as RectProps,
  Rect,
} from '@arcanejs/toolkit/components/rect';
import type {
  Events as SliderButtonEvents,
  Props as SliderButtonProps,
  SliderButton,
} from '@arcanejs/toolkit/components/slider-button';
import type {
  Events as SwitchEvents,
  Props as SwitchProps,
  Switch,
} from '@arcanejs/toolkit/components/switch';
import type {
  TabProps,
  TabsProps,
  Tab,
  Tabs,
} from '@arcanejs/toolkit/components/tabs';
import type {
  Events as TextInputEvents,
  Props as TextInputProps,
  TextInput,
} from '@arcanejs/toolkit/components/text-input';
import type {
  Props as TimelineProps,
  Timeline,
} from '@arcanejs/toolkit/components/timeline';
import type { ReactNode, Ref } from 'react';

// React Types

export type Props = { [key: string]: any };

export interface LightDeskIntrinsicElements {
  button: ButtonProps & {
    children?: never;
    onClick?: ButtonEvents['click'];
    ref?: Ref<Button>;
  };
  group: GroupProps & {
    children?: ReactNode;
    onTitleChanged?: GroupEvents['title-changed'];
    ref?: Ref<Group>;
  };
  'group-header': {
    children?: ReactNode;
    ref?: Ref<GroupHeader>;
  };
  label: LabelProps & {
    children?: never;
    ref?: Ref<Label>;
  };
  rect: RectProps & {
    children?: never;
    ref?: Ref<Rect>;
  };
  'slider-button': SliderButtonProps & {
    children?: never;
    onChange?: SliderButtonEvents['change'];
    ref?: Ref<SliderButton>;
  };
  switch: SwitchProps & {
    children?: never;
    onChange?: SwitchEvents['change'];
    ref?: Ref<Switch>;
  };
  tab: TabProps & {
    children?: ReactNode;
    ref?: Ref<Tab>;
  };
  tabs: TabsProps & {
    children?: ReactNode;
    ref?: Ref<Tabs>;
  };
  'text-input': TextInputProps & {
    children?: ReactNode;
    onChange?: TextInputEvents['change'];
    ref?: Ref<TextInput>;
  };
  timeline: TimelineProps & {
    children?: never;
    ref?: Ref<Timeline>;
  };
}
