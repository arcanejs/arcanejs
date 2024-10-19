import { Diff } from '@arcanejs/diff';
import { GroupComponentStyle } from './styles';

type BaseComponent = {
  key: number;
};

export type ButtonComponent = BaseComponent & {
  component: 'button';
  text: string;
  icon?: string;
  state:
    | {
        state: 'normal' | 'pressed';
      }
    | {
        state: 'error';
        error: string;
      };
};

export type GroupCollapsedState = 'open' | 'closed';

export type DefaultGroupCollapsedState = GroupCollapsedState | 'auto';

export type GroupHeaderComponent = BaseComponent & {
  component: 'group-header';
  children: Component[];
};

export type GroupComponent = BaseComponent &
  GroupComponentStyle & {
    component: 'group';
    title?: string;
    children: Component[];
    headers?: GroupHeaderComponent[];
    labels?: Array<{
      text: string;
    }>;
    editableTitle: boolean;
    /**
     * If set, allows the group to be collapsed,
     * by default set to the given state
     */
    defaultCollapsibleState?: DefaultGroupCollapsedState;
  };

export type LabelComponent = BaseComponent & {
  component: 'label';
  bold?: boolean;
  text: string;
};

export type RectComponent = BaseComponent & {
  component: 'rect';
  color: string;
};

export type SliderButtonComponent = BaseComponent & {
  component: 'slider_button';
  min: number;
  max: number;
  step: number;
  value: number | null;
};

export type SwitchComponent = BaseComponent & {
  component: 'switch';
  state: 'on' | 'off';
};

export type TabComponent = BaseComponent & {
  component: 'tab';
  name: string;
  child?: Component;
};

export type TabsComponent = BaseComponent & {
  component: 'tabs';
  tabs: TabComponent[];
};

export type Component =
  | ButtonComponent
  | GroupHeaderComponent
  | GroupComponent
  | LabelComponent
  | RectComponent
  | SliderButtonComponent
  | SwitchComponent
  | TabComponent
  | TabsComponent;

export type SendTreeMsg = {
  type: 'tree-full';
  root: GroupComponent;
};

export type UpdateTreeMsg = {
  type: 'tree-diff';
  diff: Diff<GroupComponent>;
};

export type ServerMessage = SendTreeMsg | UpdateTreeMsg;

export type BaseClientComponentMessage = {
  type: 'component-message';
  componentKey: number;
};

export type ButtonPressMessage = BaseClientComponentMessage & {
  component: 'button';
};

export type GroupTitleChangeMessage = BaseClientComponentMessage & {
  component: 'group';
  title: string;
};

export type SliderButtonUpdateMessage = BaseClientComponentMessage & {
  component: 'slider_button';
  value: number;
};

export type SwitchToggleMessage = BaseClientComponentMessage & {
  component: 'switch';
};

export type ClientComponentMessage =
  | ButtonPressMessage
  | GroupTitleChangeMessage
  | SliderButtonUpdateMessage
  | SwitchToggleMessage;

export type ClientMessage = ClientComponentMessage;
