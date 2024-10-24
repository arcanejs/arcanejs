import React, { FC, TouchEvent, useMemo, useState } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

import {
  THEME,
  touchIndicatorNormal,
  touchIndicatorTouching,
} from '../styling';
import { calculateClass } from '../util';

import { StageContext } from './context';

const CLASS_TOUCHING = 'touching';
const TOUCH_INDICATOR_CLASS = 'touch-indicator';

interface Props {
  className?: string;
  info: proto.SwitchComponent;
  sendMessage: ((msg: proto.ClientMessage) => void) | null;
}

const Switch: FC<Props> = ({ className, info, sendMessage }) => {
  const [touching, setTouching] = useState(false);

  const onClick = useMemo(
    () => () => {
      if (!sendMessage) return;
      console.log('sending message');
      sendMessage({
        type: 'component-message',
        componentKey: info.key,
        component: 'switch',
      });
    },
    [sendMessage, info.key],
  );

  const onTouchStart = useMemo(
    () => (event: TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      setTouching(true);
    },
    [],
  );

  const onTouchEnd = useMemo(
    () => (event: TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      setTouching(false);
      onClick();
    },
    [],
  );

  return (
    <div
      className={calculateClass(className, touching && CLASS_TOUCHING)}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={TOUCH_INDICATOR_CLASS} />
      <div className="inner">
        <div className={'slider' + (info.state === 'on' ? ' on' : '')}>
          <div className="on-text">ON</div>
          <div className="off-text">OFF</div>
          <div className="button" />
        </div>
      </div>
    </div>
  );
};

const SWITCH_HEIGHT = 30;
const BUTTON_WIDTH = 30;
const TEXT_WIDTH = 40;

const StyledSwitch: FC<Props> = styled(Switch)`
  position: relative;

  .inner {
    display: block;
    position: relative;
    overflow: hidden;
    width: ${BUTTON_WIDTH + TEXT_WIDTH}px;
    min-width: ${BUTTON_WIDTH + TEXT_WIDTH}px;
    height: ${SWITCH_HEIGHT}px;
    border-radius: 3px;
    border: 1px solid ${THEME.borderDark};

    > .slider {
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      transition: left 300ms;

      > .on-text,
      .off-text,
      .button {
        position: absolute;
        height: ${SWITCH_HEIGHT}px;
      }

      > .on-text,
      .off-text {
        width: ${TEXT_WIDTH}px;
        text-align: center;
        top: 0;
        line-height: ${SWITCH_HEIGHT - 2}px;
        text-shadow: 0 -1px rgba(0, 0, 0, 0.4);
        box-shadow:
          inset 0 1px 2px rgba(0, 0, 0, 0.2),
          0 1px 0 0 rgba(255, 255, 255, 0.15);
      }

      > .on-text {
        left: -40px;
        background: linear-gradient(
          to bottom,
          ${THEME.hintDark1},
          ${THEME.hint}
        );
      }

      > .button {
        top: -1px;
        left: -1px;
        width: ${BUTTON_WIDTH}px;
        background: linear-gradient(to bottom, #4f5053, #343436);
        text-shadow: 0 -1px rgba(0, 0, 0, 0.7);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-radius: 3px;
        border: 1px solid ${THEME.borderDark};
      }

      > .off-text {
        background: linear-gradient(to bottom, #242525, #37383a);
        left: ${BUTTON_WIDTH - 2}px;
      }

      &.on {
        left: 40px;
      }

      &:hover > .button {
        background: linear-gradient(to bottom, #5e6064, #393a3b);
      }
    }
  }

  .${TOUCH_INDICATOR_CLASS} {
    ${touchIndicatorNormal}
  }

  &.${CLASS_TOUCHING} {
    .${TOUCH_INDICATOR_CLASS} {
      ${touchIndicatorTouching}
    }
  }
`;

const SwitchWrapper: FC<Omit<Props, 'sendMessage'>> = (props) => (
  <StageContext.Consumer>
    {({ sendMessage }) => <StyledSwitch {...props} sendMessage={sendMessage} />}
  </StageContext.Consumer>
);

export { SwitchWrapper as Switch };
