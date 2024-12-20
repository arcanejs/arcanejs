import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';

interface Props {
  className?: string;
  info: proto.LabelComponent;
}

const Label: FC<Props> = ({ className, info }) => (
  <div className={className}>{info.text}</div>
);

const StyledLabel: FC<Props> = styled(Label)`
  font-weight: ${(p) => (p.info.bold ? 'bold' : 'normal')};
  white-space: nowrap;
`;

export { StyledLabel as Label };
