import { Diff } from '@arcanejs/diff';

export type BaseComponentProto<Namespace extends string> = {
  key: number;
  namespace: Namespace;
};

export type AnyComponentProto = BaseComponentProto<string>;

export type SendTreeMsg = {
  type: 'tree-full';
  root: BaseComponentProto<string>;
};

export type UpdateTreeMsg = {
  type: 'tree-diff';
  diff: Diff<BaseComponentProto<string>>;
};

export type ServerMessage = SendTreeMsg | UpdateTreeMsg;

export type BaseClientComponentMessage<Namespace extends string> = {
  type: 'component-message';
  namespace: Namespace;
  componentKey: number;
};

export type AnyClientComponentMessage = BaseClientComponentMessage<string>;

export type ClientMessage = AnyClientComponentMessage;
