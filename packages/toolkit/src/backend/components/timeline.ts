import * as proto from '../../shared/proto';
import { IDMap } from '../util/id-map';

import { Base } from './base';

type InternalProps = {
  state: proto.TimelineState;
  title: string | null;
  subtitles: string[] | null;
  source: proto.TimelineComponent['source'] | null;
};

export type Props = Partial<InternalProps>;

const DEFAULT_PROPS: InternalProps = {
  state: {
    state: 'stopped',
    totalTimeMillis: 0,
    currentTimeMillis: 0,
  },
  title: null,
  subtitles: null,
  source: null,
};

export class Timeline extends Base<InternalProps> {
  public constructor(props?: Props) {
    super(DEFAULT_PROPS, props);
  }

  /** @hidden */
  public getProtoInfo = (idMap: IDMap): proto.Component => ({
    component: 'timeline',
    key: idMap.getId(this),
    state: this.props.state,
    title: this.props.title ?? undefined,
    subtitles: this.props.subtitles ?? undefined,
    source: this.props.source ?? undefined,
  });
}
