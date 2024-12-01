'use client';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { ThemeProvider } from 'styled-components';

import { AnyComponentProto } from '@arcanejs/protocol';
import { StageContext } from '@arcanejs/toolkit-frontend';
import {
  BaseStyle,
  GlobalStyle,
  THEME,
} from '@arcanejs/toolkit-frontend/styling';
import { Group } from '@arcanejs/toolkit/components/group';
import { IDMap } from '@arcanejs/toolkit/util';
import { Base, Parent } from '@arcanejs/toolkit/components/base';
import { Switch } from '@arcanejs/toolkit/components/switch';
import {
  FrontendComponentRenderer,
  FrontendComponentRenderers,
} from '@arcanejs/toolkit-frontend/types';

type ToolkitSimulatorProps<Namespaces extends string> = {
  children?: React.ReactNode;
  renderers: FrontendComponentRenderers;
};

const ToolkitSimulatorContext = React.createContext<{
  tree: AnyComponentProto | null;
  renderComponent: (info: AnyComponentProto) => JSX.Element;
}>({
  tree: null,
  renderComponent: () => {
    throw new Error('ToolkitSimulatorContext missing');
  },
});

export const ToolkitDisplay: FC = () => {
  const { tree, renderComponent } = React.useContext(ToolkitSimulatorContext);

  return (
    <>
      <BaseStyle />
      <GlobalStyle />
      <ThemeProvider theme={THEME}>
        {tree && renderComponent(tree)}
      </ThemeProvider>
    </>
  );
};

export const ToolkitSimulatorProvider: React.FC<
  ToolkitSimulatorProps<string>
> = ({ children, renderers }) => {
  const [tree, setTree] = React.useState<AnyComponentProto | null>(null);

  const componentIDMap = useRef(new IDMap());
  const rootGroup = useRef<null | Group>(null);
  const parent = useRef<Parent>({
    removeChild: (_c: Base<any, any, any>) => {
      rootGroup.current = null;
      parent.current.updateTree();
    },
    updateTree: () => {
      setTree(rootGroup.current?.getProtoInfo(componentIDMap.current) ?? null);
    },
    log: () => console,
  });

  const preparedRenderers = useMemo(() => {
    const prepared: Record<string, FrontendComponentRenderer> = {};

    for (const renderer of renderers) {
      prepared[renderer.namespace] = renderer;
    }

    return prepared;
  }, [renderers]);

  const renderComponent = useCallback(
    (info: AnyComponentProto): JSX.Element => {
      const renderer = preparedRenderers[info.namespace];
      if (!renderer) {
        throw new Error(`no renderer for namespace ${info.namespace}`);
      }
      return renderer.render(info);
    },
    [preparedRenderers],
  );

  useEffect(() => {
    // Initialise tree

    const g = new Group({
      title: 'Hello World',
    });

    const b = g.appendChild(new Switch({ defaultValue: 'off' }));

    rootGroup.current = g;
    g.setParent(parent.current);
    parent.current.updateTree();
  }, []);

  return (
    <StageContext.Provider
      value={{
        sendMessage: (msg) =>
          rootGroup?.current?.routeMessage(componentIDMap.current, msg),
        renderComponent,
      }}
    >
      <ToolkitSimulatorContext.Provider value={{ tree, renderComponent }}>
        {children}
      </ToolkitSimulatorContext.Provider>
    </StageContext.Provider>
  );
};
