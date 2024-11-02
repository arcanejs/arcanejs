import * as React from 'react';
import { LightDeskIntrinsicElements } from './types.js';
import type { Button as ButtonComponent } from '@arcanejs/toolkit/components/button';
import type {
  Group as GroupComponent,
  GroupHeader as GroupHeaderComponent,
} from '@arcanejs/toolkit/components/group';
import type { Label as LabelComponent } from '@arcanejs/toolkit/components/label';
import type { Rect as RectComponent } from '@arcanejs/toolkit/components/rect';
import type { SliderButton as SliderButtonComponent } from '@arcanejs/toolkit/components/slider-button';
import type { Switch as SwitchComponent } from '@arcanejs/toolkit/components/switch';
import type {
  Tab as TabComponent,
  Tabs as TabsComponent,
} from '@arcanejs/toolkit/components/tabs';
import type { Timeline as TimelineComponent } from '@arcanejs/toolkit/components/timeline';
import type { TextInput as TextInputComponent } from '@arcanejs/toolkit/components/text-input';

type ComponentWithRef<T, P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;

export const Button: ComponentWithRef<
  ButtonComponent,
  LightDeskIntrinsicElements['button']
> = React.forwardRef((props, ref) =>
  React.createElement('button', { ...props, ref }, props.children),
);

export const Group: ComponentWithRef<
  GroupComponent,
  LightDeskIntrinsicElements['group']
> = React.forwardRef((props, ref) =>
  React.createElement('group', { ...props, ref }, props.children),
);

export const GroupHeader: ComponentWithRef<
  GroupHeaderComponent,
  LightDeskIntrinsicElements['group-header']
> = React.forwardRef((props, ref) =>
  React.createElement('group-header', { ...props, ref }, props.children),
);

export const Label: ComponentWithRef<
  LabelComponent,
  LightDeskIntrinsicElements['label']
> = React.forwardRef((props, ref) =>
  React.createElement('label', { ...props, ref }, props.children),
);

export const Rect: ComponentWithRef<
  RectComponent,
  LightDeskIntrinsicElements['rect']
> = React.forwardRef((props, ref) =>
  React.createElement('rect', { ...props, ref }, props.children),
);

export const SliderButton: ComponentWithRef<
  SliderButtonComponent,
  LightDeskIntrinsicElements['slider-button']
> = React.forwardRef((props, ref) =>
  React.createElement('slider-button', { ...props, ref }, props.children),
);

export const Switch: ComponentWithRef<
  SwitchComponent,
  LightDeskIntrinsicElements['switch']
> = React.forwardRef((props, ref) =>
  React.createElement('switch', { ...props, ref }, props.children),
);

export const Tab: ComponentWithRef<
  TabComponent,
  LightDeskIntrinsicElements['tab']
> = React.forwardRef((props, ref) =>
  React.createElement('tab', { ...props, ref }, props.children),
);

export const Tabs: ComponentWithRef<
  TabsComponent,
  LightDeskIntrinsicElements['tabs']
> = React.forwardRef((props, ref) =>
  React.createElement('tabs', { ...props, ref }, props.children),
);

export const TextInput: ComponentWithRef<
  TextInputComponent,
  LightDeskIntrinsicElements['text-input']
> = React.forwardRef((props, ref) =>
  React.createElement('text-input', { ...props, ref }, props.children),
);

export const Timeline: ComponentWithRef<
  TimelineComponent,
  LightDeskIntrinsicElements['timeline']
> = React.forwardRef((props, ref) =>
  React.createElement('timeline', { ...props, ref }, props.children),
);
