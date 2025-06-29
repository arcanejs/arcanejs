import React, { FC, useCallback } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol/core';

import {
  buttonPressed,
  buttonStateNormal,
  buttonStateNormalHover,
} from '../styling';
import { trackTouch } from '../util/touch';

import { StageContext } from './context';
import { calculateClass } from '../util';
import { TRANSPARENCY_SVG_URI } from './core';

const CLASS_SLIDER_DISPLAY = 'slider-display';
const CLASS_SLIDER_VALUE = 'slider-value';
const CLASS_GRADIENT = 'gradient';
const CLASS_GROW = 'grow';

const OPEN_SLIDER_WIDTH = 400;
const SLIDER_PADDING = 15;
const SLIDER_VALUE_WIDTH = 60;
const OPEN_SLIDER_INNER_WIDTH =
  OPEN_SLIDER_WIDTH - SLIDER_PADDING * 4 - SLIDER_VALUE_WIDTH * 2;

const KEYS = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Enter: 'Enter',
  Escape: 'Escape',
};

interface Props {
  className?: string;
  info: proto.SliderButtonComponent;
}

type TouchingState = {
  state: 'touching';
  startValue: number | null;
  startX: number;
  innerLeft: string;
  diff: number;
};

type State =
  | {
      state: 'closed' | 'focused' | 'mouse-down';
    }
  | TouchingState;

type DivStyle = React.HTMLAttributes<HTMLDivElement>['style'];

const NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
  // A large enough value for most usecases,
  // but to avoid inaccuracies from floating-point maths
  maximumFractionDigits: 10,
});

const getRelativeCursorPosition = (elem: Element, pageX: number) => {
  const rect = elem.getBoundingClientRect();
  return pageX - rect.left;
};

const SliderButton: FC<Props> = ({ info, className }) => {
  const { sendMessage } = React.useContext(StageContext);
  const [state, setState] = React.useState<State>({ state: 'closed' });
  const input = React.useRef<HTMLInputElement | null>(null);

  const displayValue = (value: number) => {
    if (info.max === 1 && info.min === 0) {
      return `${Math.round(value * 100)}%`;
    }
    return NUMBER_FORMATTER.format(value);
  };

  const sendValue = useCallback(
    (value: number) =>
      sendMessage<proto.CoreComponentMessage>?.({
        type: 'component-message',
        namespace: 'core',
        componentKey: info.key,
        component: 'slider_button',
        value: value,
      }),
    [sendMessage, info.key],
  );

  const sanitizeValue = useCallback(
    (value: number) => {
      const i = Math.round((value - info.min) / info.step);
      const v = i * info.step + info.min;
      return Math.max(info.min, Math.min(info.max, v));
    },
    [info.min, info.max, info.step],
  );

  const getNewValue = useCallback(
    (startValue: null | number, diff: number) => {
      return sanitizeValue((startValue || 0) + diff);
    },
    [sanitizeValue],
  );

  const getCurrentInputValue = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const float = parseFloat(e.currentTarget.value);
      return sanitizeValue(isNaN(float) ? info.value || 0 : float);
    },
    [info.value, sanitizeValue],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYS.ArrowDown || e.key === KEYS.ArrowUp) {
      const currentValue = getCurrentInputValue(e);
      const diff = e.key === KEYS.ArrowUp ? info.step : -info.step;
      const newValue = sanitizeValue(currentValue + diff);
      e.currentTarget.value = NUMBER_FORMATTER.format(newValue);
      sendValue(newValue);
    } else if (e.key === KEYS.Enter) {
      const sanitizedValue = getCurrentInputValue(e);
      sendValue(sanitizedValue);
      e.currentTarget.value = NUMBER_FORMATTER.format(sanitizedValue);
    } else if (e.key === KEYS.Escape) {
      input.current?.blur();
    }
  };

  const onFocus = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setState({ state: 'focused' });
    e.currentTarget.value = `${info.value || 0}`;
  };

  const onBlur = () => {
    setState({ state: 'closed' });
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      const originalPageX = touch.pageX;
      const cursorPosition = getRelativeCursorPosition(
        e.currentTarget,
        touch.pageX,
      );
      const start = onDown(cursorPosition);
      trackTouch(
        touch,
        (p) => {
          const amntDiff = (p.pageX - originalPageX) / OPEN_SLIDER_INNER_WIDTH;
          const newValueDiff = (info.max - info.min) * amntDiff;
          sendValue(getNewValue(start.startValue, newValueDiff));
          setState({ ...start, diff: newValueDiff });
        },
        (p) => {
          const amntDiff = (p.pageX - originalPageX) / OPEN_SLIDER_INNER_WIDTH;
          const newValueDiff = (info.max - info.min) * amntDiff;
          sendValue(getNewValue(start.startValue, newValueDiff));
          setState({ state: 'closed' });
        },
      );
      return;
    }
  };

  const onDown = (cursorStartPosition: number) => {
    const value = info.value === null ? 0 : info.value;
    /** Value between 0 - 1 representing where between min - max the value is */
    const amnt = (value - info.min) / (info.max - info.min);
    const innerLeft =
      cursorStartPosition -
      amnt * OPEN_SLIDER_INNER_WIDTH -
      SLIDER_PADDING * 2 -
      SLIDER_VALUE_WIDTH +
      'px';
    const start: TouchingState = {
      state: 'touching',
      startValue: info.value,
      startX: cursorStartPosition,
      innerLeft,
      diff: 0,
    };
    setState(start);
    return start;
  };

  const value =
    state.state === 'touching'
      ? getNewValue(state.startValue, state.diff)
      : info.value;
  const valueDisplay = value !== null ? displayValue(value) : '';
  const valueCSSPercent = value
    ? ((value - info.min) / (info.max - info.min)) * 100 + '%'
    : '0';

  const gradientStops =
    info.gradient &&
    info.gradient.map((g) => `${g.color} ${g.position * 100}%`);
  const sliderGradient: DivStyle = gradientStops
    ? {
        background: `linear-gradient(90deg, ${gradientStops.join(', ')}), url(${TRANSPARENCY_SVG_URI})`,
      }
    : undefined;

  return (
    <div
      className={calculateClass(
        className,
        `state-${state.state}`,
        info.grow && CLASS_GROW,
      )}
    >
      <div
        className="inner"
        onMouseDown={() => setState({ state: 'mouse-down' })}
        onMouseUp={() => input.current?.focus()}
        onTouchStart={onTouchStart}
        style={state.state === 'touching' ? { left: state.innerLeft } : {}}
      >
        <input
          type="text"
          ref={input}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <div className={CLASS_SLIDER_VALUE}>{valueDisplay}</div>
        <div
          className={calculateClass(
            CLASS_SLIDER_DISPLAY,
            sliderGradient && CLASS_GRADIENT,
          )}
          style={sliderGradient}
        >
          <div className="inner" style={{ width: valueCSSPercent }} />
        </div>
        <div className={CLASS_SLIDER_VALUE}>{valueDisplay}</div>
      </div>
    </div>
  );
};

const StyledSliderButton: FC<Props> = styled(SliderButton)`
  position: relative;
  min-width: 100px;
  min-height: 30px;

  &.${CLASS_GROW} {
    flex-grow: 1;
  }

  > .inner {
    position: absolute;
    display: flex;
    align-items: center;
    padding: 0 ${SLIDER_PADDING / 2}px;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    cursor: pointer;
    transition: all 200ms;
    border-radius: 3px;
    border: 1px solid ${(p) => p.theme.borderDark};
    ${buttonStateNormal}

    > input {
      color: ${(p) => p.theme.textNormal};
      opacity: 0;
      margin: 0 -9px;
      padding: 6px 8px;
      width: 0;
      pointer-events: none;
      transition: all 200ms;
      border-radius: 3px;
      background: ${(p) => p.theme.bgDark1};
      border: 1px solid ${(p) => p.theme.borderDark};
      overflow: hidden;
      box-shadow: ${(p) => p.theme.shadows.boxShadowInset};
    }

    > .${CLASS_SLIDER_DISPLAY} {
      flex-grow: 1;
      margin: 0 ${SLIDER_PADDING / 2}px;
      height: 4px;
      background: ${(p) => p.theme.bgDark1};
      border: 1px solid ${(p) => p.theme.borderDark};

      > .inner {
        height: 100%;
        background: ${(p) => p.theme.hint};
      }

      &.${CLASS_GRADIENT} {
        height: 10px;

        > .inner {
          position: relative;
          background: none;
          border-right: 2px solid ${(p) => p.theme.borderDark};

          &::before {
            content: '';
            position: absolute;
            width: 4px;
            top: -5px;
            bottom: -5px;
            right: -3px;
            background: ${(p) => p.theme.borderDark};
          }

          &::after {
            content: '';
            position: absolute;
            width: 2px;
            top: -4px;
            bottom: -4px;
            right: -2px;
            background: ${(p) => p.theme.textNormal};
          }
        }
      }
    }

    > .${CLASS_SLIDER_VALUE} {
      width: ${SLIDER_VALUE_WIDTH}px;
      margin: 0 -${SLIDER_VALUE_WIDTH / 2}px;
      line-height: 30px;
      text-align: center;
      opacity: 0;
    }

    &:hover {
      ${buttonStateNormalHover}
    }
  }

  &.state-mouse-down {
    > .inner {
      ${buttonPressed}
    }
  }

  &.state-focused {
    > .inner {
      > input {
        opacity: 1;
        width: 60%;
        padding: 0 5px;
        margin: 0;
      }
    }
  }

  &.state-touching {
    z-index: 100;

    .inner {
      background: ${(p) => p.theme.bgDark1};
      width: ${OPEN_SLIDER_WIDTH}px;

      > .${CLASS_SLIDER_VALUE} {
        opacity: 1;
        margin: 0 ${SLIDER_PADDING / 2}px;
      }
    }
  }
`;

export { StyledSliderButton as SliderButton };
