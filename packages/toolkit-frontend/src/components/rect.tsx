import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

const TRANSPARENCY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <rect width="10px" height="10px" fill="#333" />
  <rect width="5px" height="5px" fill="#ddd" y="5"/>
  <rect width="5px" height="5px" fill="#ddd" x="5"/>
</svg>
`;

interface Props {
  className?: string;
  info: proto.RectComponent;
}

const Wrapper = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 3px;
  overflow: hidden;
  background: url('data:image/svg+xml,${encodeURIComponent(TRANSPARENCY_SVG)}');
  background-repeat: repeat;
  background-size: 10px;
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
