import React, { FC, TouchEvent, useMemo, useState } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';

import { touchIndicatorNormal, touchIndicatorTouching } from '../styling';
import { calculateClass } from '../util';

import { StageContext } from './context';

const CLASS_TOUCHING = 'touching';
const TOUCH_INDICATOR_CLASS = 'touch-indicator';

interface Props {
  className?: string;
  info: proto.SwitchComponent;
}

const Switch: FC<Props> = ({ className, info }) => {
  const { sendMessage } = React.useContext(StageContext);
  const [touching, setTouching] = useState(false);

  const onClick = useMemo(
    () => () => {
      sendMessage<proto.CoreComponentMessage>?.({
        type: 'component-message',
        namespace: 'core',
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
    border: 1px solid ${(p) => p.theme.borderDark};

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
        text-shadow: ${(p) => p.theme.shadows.textShadowActive};
        box-shadow:
          inset 0 1px 2px rgba(0, 0, 0, 0.2),
          0 1px 0 0 rgba(255, 255, 255, 0.15);
      }

      > .on-text {
        left: -40px;
        background: ${(p) => p.theme.gradients.hintPressed};
      }

      > .button {
        top: -1px;
        left: -1px;
        width: ${BUTTON_WIDTH}px;
        background: ${(p) => p.theme.gradients.button};
        text-shadow: ${(p) => p.theme.shadows.textShadow};
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-radius: 3px;
        border: 1px solid ${(p) => p.theme.borderDark};
      }

      > .off-text {
        background: ${(p) => p.theme.gradients.buttonActive};
        left: ${BUTTON_WIDTH - 2}px;
      }

      &.on {
        left: 40px;
      }

      &:hover > .button {
        background: ${(p) => p.theme.gradients.buttonHover};
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

export { StyledSwitch as Switch };
