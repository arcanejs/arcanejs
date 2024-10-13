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

export type Component = ButtonComponent | GroupHeaderComponent | GroupComponent;

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

export interface ButtonPressMessage extends BaseClientComponentMessage {
  component: 'button';
}

export type GroupTitleChangeMessage = BaseClientComponentMessage & {
  component: 'group';
  title: string;
};

export type ClientComponentMessage =
  | ButtonPressMessage
  | GroupTitleChangeMessage;

export type ClientMessage = ClientComponentMessage;
