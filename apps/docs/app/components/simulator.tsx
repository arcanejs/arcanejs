'use client';
import React, { FC, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';

import { GroupComponent } from '@arcanejs/protocol';
import {
  renderStandardComponent,
  StageContext,
} from '@arcanejs/toolkit-frontend/components';
import {
  BaseStyle,
  GlobalStyle,
  THEME,
} from '@arcanejs/toolkit-frontend/styling';
import { Group } from '@arcanejs/toolkit/components/group';
import { IDMap } from '@arcanejs/toolkit/util';
import { Component, Parent } from '@arcanejs/toolkit/components/base';
import { ToolkitRenderer } from '@arcanejs/react-toolkit';

type ToolkitSimulatorProps = {
  children?: React.ReactNode;
  root: JSX.Element;
};

const ToolkitSimulatorContext = React.createContext<{
  tree: GroupComponent | null;
}>({ tree: null });

export const ToolkitDisplay: FC = () => {
  const { tree } = React.useContext(ToolkitSimulatorContext);

  return (
    <>
      <BaseStyle />
      <GlobalStyle />
      <ThemeProvider theme={THEME}>
        {tree && renderStandardComponent(tree)}
      </ThemeProvider>
    </>
  );
};

export const ToolkitSimulatorProvider: React.FC<ToolkitSimulatorProps> = ({
  children,
  root,
}) => {
  const [tree, setTree] = React.useState<GroupComponent | null>(null);

  const componentIDMap = useRef(new IDMap());
  const rootGroup = useRef<null | Group>(null);
  const parent = useRef<Parent>({
    removeChild: (c: Component) => {
      rootGroup.current = null;
      parent.current.updateTree();
    },
    updateTree: () => {
      setTree(rootGroup.current?.getProtoInfo(componentIDMap.current) ?? null);
    },
  });

  useEffect(() => {
    // Initialise tree

    if (rootGroup.current) {
      rootGroup.current.setParent(null);
    }

    rootGroup.current = new Group();
    rootGroup.current.setParent(parent.current);

    // ToolkitRenderer.renderGroup(root, rootGroup.current);

  }, [root]);

  return (
    <StageContext.Provider
      value={{
        sendMessage: (msg) =>
          rootGroup?.current?.routeMessage(componentIDMap.current, msg),
        renderComponent: renderStandardComponent,
      }}
    >
      <ToolkitSimulatorContext.Provider value={{ tree }}>
        {children}
      </ToolkitSimulatorContext.Provider>
    </StageContext.Provider>
  );
};
