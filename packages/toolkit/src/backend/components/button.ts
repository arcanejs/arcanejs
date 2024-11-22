import * as proto from '@arcanejs/protocol';
import { IDMap } from '../util/id-map';

import { Base, EventEmitter, Listenable } from './base';

export type Events = {
  click: () => void | Promise<void>;
};

export type ButtonMode = 'normal' | 'pressed';

export type InternalProps = {
  text: string | null;
  icon: string | null;
  mode: ButtonMode;
  error: string | null;
  onClick?: Events['click'] | null;
};

export type Props = Partial<InternalProps>;

const DEFAULT_PROPS: InternalProps = {
  text: null,
  icon: null,
  mode: 'normal',
  error: null,
  onClick: null,
};

export class Button extends Base<InternalProps> implements Listenable<Events> {
  /** @hidden */
  private readonly events = new EventEmitter<Events>();

  public constructor(props?: Props) {
    super(DEFAULT_PROPS, props, {
      onPropsUpdated: (oldProps) =>
        this.events.processPropChanges(
          {
            onClick: 'click',
          },
          oldProps,
          this.props,
        ),
    });
    this.triggerInitialPropsUpdate();
  }

  addListener = this.events.addListener;
  removeListener = this.events.removeListener;

  public setText = (text: string | null) => {
    this.updateProps({ text });
    return this;
  };

  public setIcon = (icon: string | undefined | null) => {
    this.updateProps({ icon: icon ?? null });
    return this;
  };

  public setMode = (mode: ButtonMode) => {
    this.updateProps({
      mode,
      error: null,
    });
    return this;
  };

  /** @hidden */
  public getProtoInfo = (idMap: IDMap): proto.ButtonComponent => {
    return {
      component: 'button',
      key: idMap.getId(this),
      text: this.props.text || '',
      state: this.props.error
        ? { state: 'error', error: this.props.error }
        : { state: this.props.mode },
      icon: this.props.icon ?? undefined,
    };
  };

  /** @hidden */
  public handleMessage = (message: proto.ClientComponentMessage) => {
    if (message.component === 'button') {
      this.events
        .emit('click')
        .then(() => {
          if (this.props.error) {
            this.updateProps({
              error: null,
            });
          }
        })
        .catch((e) => {
          this.updateProps({
            error: `${e}`,
          });
        });
    }
  };
}
