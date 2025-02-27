import {
  BaseComponentProto,
  AnyClientComponentMessage,
} from '@arcanejs/protocol';
import { IDMap } from '../util/id-map';
import { Logger } from '@arcanejs/protocol/logging';
import { ToolkitConnection } from '../toolkit';

export abstract class Base<
  Namespace extends string,
  Proto extends BaseComponentProto<Namespace>,
  Props,
> {
  /** @hidden */
  private parent: Parent | null = null;

  /** @hidden */
  private readonly defaultProps: Props;

  /** @hidden */
  private _props: Props;

  /** @hidden */
  private _onPropsUpdated: {
    listener: (oldProps: Props) => void;
    /**
     * True if it's safe to call triggerInitialPropsUpdate()
     * with the default props.
     *
     * This will not be possible if the props have changed between initial
     * construction and the call to this function.
     */
    canSendInitialPropsUpdate: () => boolean;
  } | null = null;

  public constructor(
    defaultProps: Props,
    props?: Partial<Props>,
    options?: { onPropsUpdated?: (oldProps: Props) => void },
  ) {
    this.defaultProps = defaultProps;
    this._props = Object.freeze({
      ...defaultProps,
      ...props,
    });
    if (options?.onPropsUpdated) {
      const initialProps = this._props;
      this._onPropsUpdated = {
        listener: options.onPropsUpdated,
        canSendInitialPropsUpdate: () => this._props === initialProps,
      };
    }
  }

  /**
   * Call if
   */
  public triggerInitialPropsUpdate = () => {
    if (!this._onPropsUpdated?.canSendInitialPropsUpdate()) {
      throw new Error('Cannot call triggerInitialPropsUpdate()');
    }
    this._onPropsUpdated.listener(this.defaultProps);
  };

  public log = (): Logger | null => {
    return this.parent?.log() || null;
  };

  public get props(): Props {
    return this._props;
  }

  public set props(props: Partial<Props>) {
    this.setProps(props);
  }

  public setProps = (props: Partial<Props>) => {
    const oldProps = this._props;
    this._props = Object.freeze({
      ...this.defaultProps,
      ...props,
    });
    this._onPropsUpdated?.listener?.(oldProps);
    this.updateTree();
  };

  public updateProps = (updates: Partial<Props>) => {
    const oldProps = this._props;
    this._props = Object.freeze({
      ...this._props,
      ...updates,
    });
    this._onPropsUpdated?.listener?.(oldProps);
    this.updateTree();
  };

  /** @hidden */
  public setParent(parent: Parent | null) {
    if (this.parent && this.parent !== parent) {
      this.parent.removeChild(this);
    }
    this.parent = parent;
  }

  /** @hidden */
  public updateTree() {
    if (this.parent) this.parent.updateTree();
  }

  /** @hidden */
  public abstract getProtoInfo(idMap: IDMap): Proto;

  /** @hidden */
  public handleMessage(
    _message: AnyClientComponentMessage,
    _connection: ToolkitConnection,
  ): void {}

  public routeMessage(
    _idMap: IDMap,
    _message: AnyClientComponentMessage,
    _connection: ToolkitConnection,
  ): void {
    // Do nothing by default, only useful for Parent components
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = Base<string, BaseComponentProto<string>, any>;

/** @hidden */
export interface Parent {
  updateTree(): void;
  removeChild(component: AnyComponent): void;
  log(): Logger | null;
}

export abstract class BaseParent<
    Namespace extends string,
    Proto extends BaseComponentProto<Namespace>,
    T,
  >
  extends Base<Namespace, Proto, T>
  implements Parent
{
  /** @hidden */
  private children: readonly AnyComponent[] = [];

  public abstract validateChildren(children: AnyComponent[]): void;

  public appendChildren = <CS extends AnyComponent[]>(...children: CS): CS => {
    for (const c of children) {
      const newChildren = [...this.children.filter((ch) => ch !== c), c];
      this.validateChildren(newChildren);
      this.children = Object.freeze(newChildren);
      c.setParent(this);
    }
    this.updateTree();
    return children;
  };

  public appendChild = <C extends AnyComponent>(child: C): C => {
    this.appendChildren(child);
    return child;
  };

  public removeChild = (component: AnyComponent) => {
    const match = this.children.findIndex((c) => c === component);
    if (match >= 0) {
      const removingChild = this.children[match];
      const newChildren = [
        ...this.children.slice(0, match),
        ...this.children.slice(match + 1),
      ];
      this.validateChildren(newChildren);
      this.children = Object.freeze(newChildren);
      removingChild?.setParent(null);
      this.updateTree();
    }
  };

  public removeAllChildren = () => {
    this.children.map((c) => c.setParent(null));
    this.children = Object.freeze([]);
    this.updateTree();
  };

  /**
   * Return all children components that messages need to be routed to
   */
  public getChildren = (): readonly AnyComponent[] => this.children;

  /**
   * TODO: we can do this better, right now it broadcasts the message to all
   * components of the tree
   *
   * @hidden
   */
  public routeMessage(
    idMap: IDMap,
    message: AnyClientComponentMessage,
    connection: ToolkitConnection,
  ) {
    if (idMap.getId(this) === message.componentKey) {
      this.handleMessage(message, connection);
    } else {
      for (const c of this.children) {
        if (idMap.getId(c) === message.componentKey) {
          c.handleMessage(message, connection);
        } else {
          c.routeMessage(idMap, message, connection);
        }
      }
    }
  }

  public insertBefore(child: AnyComponent, beforeChild: AnyComponent) {
    // Remove child from current parent (if it exists)
    const filteredChildren = this.children.filter((c) => c !== child);
    // Find position of beforeChild
    let match = filteredChildren.findIndex((c) => c === beforeChild);
    if (match === -1) {
      // If beforeChild is not found, insert at the end
      match = filteredChildren.length;
    }
    const newChildren = [
      ...filteredChildren.slice(0, match),
      child,
      ...filteredChildren.slice(match),
    ];
    this.validateChildren(newChildren);
    this.children = Object.freeze(newChildren);
    child.setParent(this);
    this.updateTree();
  }
}

export interface Listenable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Map extends Record<string, (...args: any[]) => void>,
> {
  addListener<T extends keyof Map>(type: T, listener: Map[T]): void;
  removeListener<T extends keyof Map>(type: T, listener: Map[T]): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<Map extends Record<string, (...args: any[]) => void>>
  implements Listenable<Map>
{
  private readonly listeners = new Map<
    keyof Map,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Set<(...args: any[]) => void>
  >();

  addListener = <T extends keyof Map>(type: T, listener: Map[T]) => {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(listener);
  };

  removeListener = <T extends keyof Map>(type: T, listener: Map[T]) => {
    this.listeners.get(type)?.delete(listener);
  };

  emit = <T extends keyof Map>(
    type: T,
    ...args: Parameters<Map[T]>
  ): Promise<unknown> => {
    return Promise.all(
      [...(this.listeners.get(type) || [])].map(
        (l) =>
          new Promise((resolve, reject) => {
            try {
              resolve(l(...args));
            } catch (e) {
              reject(e);
            }
          }),
      ),
    );
  };

  /**
   * Process prop changes to update listeners
   */
  processPropChanges = <
    Mapping extends Record<string, keyof Map>,
    Props extends {
      [key in keyof Mapping]?: Map[Mapping[key]] | null | undefined;
    },
  >(
    /**
     * Mapping from prop key to event name
     */
    mapping: Mapping,
    oldProps: Props,
    newProps: Props,
  ) => {
    for (const key of Object.keys(mapping) as (keyof Mapping)[]) {
      const prev = oldProps[key] as unknown as Map[Mapping[keyof Mapping]];
      const next = newProps[key] as unknown as Map[Mapping[keyof Mapping]];
      if (prev !== next) {
        const eventName = mapping[key];
        prev && this.removeListener(eventName, prev);
        next && this.addListener(eventName, next);
      }
    }
  };
}
