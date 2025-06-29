import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';
import { TRANSPARENCY_SVG_URI } from './core';
import { calculateClass } from '../util';

interface Props {
  className?: string;
  info: proto.RectComponent;
}

const CLS_GROW = 'grow';

const Wrapper = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 3px;
  overflow: hidden;
  background: url('${TRANSPARENCY_SVG_URI}');
  background-repeat: repeat;
  background-size: 10px;
  border: 1px solid ${(p) => p.theme.borderDark};

  &.${CLS_GROW} {
    flex-grow: 1;
  }
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
`;

const Rect: FC<Props> = ({ className, info }) => (
  <Wrapper className={calculateClass(className, info.grow && CLS_GROW)}>
    <Inner style={{ backgroundColor: info.color }} />
  </Wrapper>
);

export { Rect };
