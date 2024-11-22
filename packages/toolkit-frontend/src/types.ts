import { BaseComponentProto } from '@arcanejs/protocol';

export type FrontendComponentRenderer = {
  namespace: string;
  render: (component: BaseComponentProto<string>) => JSX.Element;
};

export type FrontendComponentRenderers = FrontendComponentRenderer[];
