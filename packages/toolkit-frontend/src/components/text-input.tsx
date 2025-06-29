import React, { FC, useEffect } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';

import { StageContext } from './context';

interface Props {
  className?: string;
  info: proto.TextInputComponent;
}

const TextInput: FC<Props> = ({ className, info }) => {
  const { sendMessage } = React.useContext(StageContext);
  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Manually update value of text input if it doesn't match
    if (ref.current && ref.current.value !== info.value) {
      ref.current.value = info.value;
    }
  }, [info.value]);

  return (
    <input
      className={className}
      defaultValue={info.value}
      ref={ref}
      onChange={(ev) =>
        sendMessage<proto.CoreComponentMessage>?.({
          type: 'component-message',
          namespace: 'core',
          componentKey: info.key,
          component: 'text-input',
          value: ev.target.value,
        })
      }
    />
  );
};

const StyledTextInput: FC<Props> = styled(TextInput)`
  position: relative;
  box-sizing: border-box;
  padding: 6px 8px;
  border-radius: 3px;
  background: ${(p) => p.theme.bgDark1};
  border: 1px solid ${(p) => p.theme.borderDark};
  overflow: hidden;
  box-shadow: ${(p) => p.theme.shadows.boxShadowInset};
  color: ${(p) => p.theme.textNormal};
  text-shadow: ${(p) => p.theme.shadows.textShadow};

  @media (max-width: 500px) {
    flex-basis: 100%;
  }
`;

export { StyledTextInput as TextInput };
