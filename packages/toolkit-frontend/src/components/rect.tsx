import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';
import { THEME } from '../styling';
import { TRANSPARENCY_SVG_URI } from './core';

interface Props {
  className?: string;
  info: proto.RectComponent;
}

const Wrapper = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 3px;
  overflow: hidden;
  background: url('${TRANSPARENCY_SVG_URI}');
  background-repeat: repeat;
  background-size: 10px;
  border: 1px solid ${THEME.borderDark};
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
`;

const Rect: FC<Props> = ({ className, info }) => (
  <Wrapper className={className}>
    <Inner style={{ backgroundColor: info.color }} />
  </Wrapper>
);

export { Rect };
