import * as proto from '@arcanejs/protocol';
import { IDMap } from '../util/id-map';

import { Base } from './base';

type InternalProps = Pick<proto.RectComponent, 'color' | 'grow'>;

export type Props = Partial<InternalProps>;

const DEFAULT_PROPS: InternalProps = {
  color: 'rgba(0, 0, 0, 0)',
};

/**
 * A simple rectangle component. Could be used for example to indicate
 * certain states, or represent the color of certain lights or fixtures,
 * or perhaps colors used in a chase.
 */
export class Rect extends Base<InternalProps> {
  public constructor(props?: Props) {
    super(DEFAULT_PROPS, props);
  }

  /** @hidden */
  public getProtoInfo(idMap: IDMap): proto.Component {
    return {
      component: 'rect',
      key: idMap.getId(this),
      ...this.props,
    };
  }

  public setColor(color: string): Rect {
    this.updateProps({ color });
    return this;
  }
}
