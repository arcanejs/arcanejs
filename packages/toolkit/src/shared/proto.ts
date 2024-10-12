import { Diff } from '@arcanejs/diff';
import { GroupComponentStyle } from './styles';

type BaseComponent = {
  key: number;
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

export type Component = GroupHeaderComponent | GroupComponent;

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

export type GroupTitleChangeMessage = BaseClientComponentMessage & {
  component: 'group';
  title: string;
};

export type ClientComponentMessage = GroupTitleChangeMessage;

export type ClientMessage = ClientComponentMessage;
