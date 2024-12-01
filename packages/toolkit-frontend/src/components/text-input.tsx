import React, { FC, useEffect } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';

import { StageContext } from './context';

import { THEME } from '../styling';

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
  background: ${THEME.bgDark1};
  border: 1px solid ${THEME.borderDark};
  overflow: hidden;
  box-shadow: inset 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
  color: ${THEME.textNormal};
  text-shadow: 0 -1px rgba(0, 0, 0, 0.7);

  @media (max-width: 500px) {
    flex-basis: 100%;
  }
`;

export { StyledTextInput as TextInput };
