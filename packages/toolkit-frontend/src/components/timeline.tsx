import React, { FC, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import * as proto from '@arcanejs/protocol';

import { Icon } from './core';

import { THEME } from '../styling';

interface Props {
  className?: string;
  info: proto.TimelineComponent;
}

const Wrapper = styled.div`
  flex-grow: 1;
`;

const Data = styled.div`
  display: flex;
`;

const Metadata = styled.div`
  flex-grow: 1;
`;

const SourceData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
`;

const IndicatorIcon = styled(Icon)`
  font-size: 40px;
`;

const Bar = styled.div`
  width: 100%;
  height: 10px;
  border: 1px solid ${THEME.borderDark};
  background: ${THEME.borderDark};
`;

const Fill = styled.div`
  height: 100%;
  background: ${THEME.hint};
`;

const Title = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const Subtitle = styled.div`
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const Timeline: FC<Props> = (props) => {
  const { className, info } = props;

  const frameState = React.useRef<{
    animationFrame: number;
    /** the state that's currenly set */
    state: proto.TimelineState | null;
  }>({
    animationFrame: -1,
    state: null,
  });

  const [currentTimeMillis, setCurrentTimeMillis] = useState<number>(0);

  useEffect(() => {
    frameState.current.state = info.state;
    const recalculateCurrentTimeMillis = () => {
      if (frameState.current.state !== info.state) {
        return;
      }

      if (info.state.state === 'playing') {
        setCurrentTimeMillis(
          (Date.now() - info.state.effectiveStartTime) * info.state.speed,
        );
        frameState.current.animationFrame = window.requestAnimationFrame(
          recalculateCurrentTimeMillis,
        );
      } else {
        setCurrentTimeMillis(info.state.currentTimeMillis);
      }
    };

    recalculateCurrentTimeMillis();

    return () => {
      window.cancelAnimationFrame(frameState.current.animationFrame);
    };
  }, [frameState, info.state]);

  return (
    <Wrapper className={className}>
      <Data>
        <Metadata>
          {info.title && <Title>{info.title}</Title>}
          {info.subtitles?.map((subtitle, k) => (
            <Subtitle key={k}>{subtitle}</Subtitle>
          ))}
        </Metadata>
        <SourceData>
          {info.source?.name}
          <IndicatorIcon
            icon={info.state.state === 'playing' ? 'play_arrow' : 'pause'}
          />
        </SourceData>
      </Data>
      <Bar>
        <Fill
          style={{
            width: `${Math.min(100, (100 * currentTimeMillis) / info.state.totalTimeMillis)}%`,
          }}
        />
      </Bar>
    </Wrapper>
  );
};

export { Timeline };
