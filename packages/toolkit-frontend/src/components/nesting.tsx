import React, { FC } from 'react';
import { styled } from 'styled-components';

import { calculateClass } from '../util';

import { THEME } from '../styling';

type GroupColor = 'dark' | 'lighter' | 'lighterer';

function nextColor(currentColor: GroupColor): GroupColor {
  switch (currentColor) {
    case 'dark':
      return 'lighter';
    case 'lighter':
      return 'dark';
    case 'lighterer':
      return 'dark';
  }
}

const LastNestedColor = React.createContext<GroupColor>('dark');

type NestContentProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
};

const NestedContent: FC<NestContentProps> = ({ className, children }) => {
  const color = React.useContext(LastNestedColor);

  return (
    <div className={calculateClass(className, `color-${color}`)}>
      <LastNestedColor.Provider value={nextColor(color)}>
        {children}
      </LastNestedColor.Provider>
    </div>
  );
};

NestedContent.displayName = 'NestedContent';

const StyledNestedContent: FC<NestContentProps> = styled(NestedContent)`
  padding: ${THEME.sizingPx.spacing / 2}px;
  box-shadow: inset 0px 0px 8px 0px rgba(0, 0, 0, 0.3);

  &.color-dark {
    background: ${THEME.bgDark1};
  }

  &.color-lighter {
    background: ${THEME.bg};
  }

  &.color-lighterer {
    background: ${THEME.bgLight1};
  }
`;

export { StyledNestedContent as NestedContent };
