import React, { FC } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

import { StageContext } from './context';

import { THEME } from '../styling';

interface Props {
  className?: string;
  info: proto.TextInputComponent;
  sendMessage: ((msg: proto.ClientMessage) => void) | null;
}

const TextInput: FC<Props> = ({ className, info, sendMessage }) => {
  return (
    <input
      className={className}
      value={info.value}
      onChange={(ev) =>
        sendMessage?.({
          type: 'component-message',
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

const TextInputWrapper: FC<Omit<Props, 'sendMessage'>> = (props) => (
  <StageContext.Consumer>
    {({ sendMessage }) => (
      <StyledTextInput {...props} sendMessage={sendMessage} />
    )}
  </StageContext.Consumer>
);

export { TextInputWrapper as TextInput };
