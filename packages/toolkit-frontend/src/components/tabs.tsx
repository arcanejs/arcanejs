import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

import { THEME } from '../styling';
import { calculateClass } from '../util';

import { StageContext } from './context';
import { NestedContent } from './nesting';

interface Props {
  info: proto.TabsComponent;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${THEME.borderDark};
  border: 1px solid ${THEME.borderDark};
`;

const TabList = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${THEME.borderDark};
`;

const TabItem = styled.div`
  height: ${THEME.sizingPx.spacing * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 ${THEME.sizingPx.spacing}px;
  cursor: pointer;
  background: ${THEME.bgDark1};
  margin-right: 1px;

  &:hover,
  &.touching {
    background: ${THEME.bgLight1};
  }

  &.current {
    color: ${THEME.hint};

    &::after {
      content: '';
      border-bottom: 2px solid ${THEME.hint};
      display: block;
      margin-top: ${THEME.sizingPx.spacing / 2}px;
    }
  }
`;

const Tabs: FC<Props> = (props) => {
  const { renderComponent } = React.useContext(StageContext);
  const [touching, setTouching] = React.useState<null | number>(null);
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const tab = props.info.tabs[currentTab];

  return (
    <Wrapper>
      <TabList>
        {props.info.tabs.map((tab, i) => (
          <TabItem
            key={i}
            className={calculateClass(
              touching === i && 'touching',
              currentTab === i && 'current',
            )}
            onClick={() => setCurrentTab(i)}
            onTouchStart={(event) => {
              event.preventDefault();
              setTouching(i);
            }}
            onTouchEnd={(event) => {
              event.preventDefault();
              setTouching(null);
              setCurrentTab(i);
            }}
          >
            {tab.name}
          </TabItem>
        ))}
      </TabList>
      <NestedContent>{tab?.child && renderComponent(tab.child)}</NestedContent>
    </Wrapper>
  );
};

export { Tabs };
