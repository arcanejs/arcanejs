import { GroupComponentStyle } from './styles';

interface BaseComponent {
  key: number;
}

export type GroupCollapsedState = 'open' | 'closed';

export type DefaultGroupCollapsedState = GroupCollapsedState | 'auto';

export interface GroupHeaderComponent extends BaseComponent {
  component: 'group-header';
  children: Component[];
}

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

export type Component = GroupHeaderComponent | GroupComponent;

export interface UpdateTreeMsg {
  type: 'update_tree';
  root: GroupComponent;
}

export type ServerMessage = UpdateTreeMsg;

export interface BaseClientComponentMessage {
  type: 'component_message';
  componentKey: number;
}

export interface GroupTitleChangeMessage extends BaseClientComponentMessage {
  component: 'group';
  title: string;
}

export type ClientComponentMessage = GroupTitleChangeMessage;

export type ClientMessage = ClientComponentMessage;
