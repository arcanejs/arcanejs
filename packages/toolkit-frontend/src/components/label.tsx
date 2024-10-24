import * as React from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

interface Props {
  className?: string;
  info: proto.LabelComponent;
}

const Label: React.FunctionComponent<Props> = ({ className, info }) => (
  <div className={className}>{info.text}</div>
);

const StyledLabel = styled(Label)`
  font-weight: ${(p) => (p.info.bold ? 'bold' : 'normal')};
  white-space: nowrap;
`;

export { StyledLabel as Label };
