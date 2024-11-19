import Reconciler from 'react-reconciler';
import React from 'react';
import { DefaultEventPriority } from 'react-reconciler/constants';
import * as ld from '@arcanejs/toolkit';
import { Base, BaseParent } from '@arcanejs/toolkit/components/base';
import type { Props as GroupProps } from '@arcanejs/toolkit/components/group';
import type { LightDeskIntrinsicElements, Props } from './types';
import { LoggerContext } from './logging';
import { CUSTOM_PREFIX, PreparedCustomComponents } from './custom';

export type { LightDeskIntrinsicElements };
export * from './components.js';

type Type = keyof LightDeskIntrinsicElements;
type Container = ld.Group;
type Instance = ld.Component;
type TextInstance = ld.Label;

type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type _ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = number;

type LightDeskHostConfig = Reconciler.HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  _ChildSet,
  TimeoutHandle,
  NoTimeout
>;

const isType = <T extends keyof LightDeskIntrinsicElements>(
  targetType: T,
  type: Type,
  _props: Props,
): _props is LightDeskIntrinsicElements[T] => targetType === type;

const canSetProps = (instance: ld.Component): instance is Base<unknown> =>
  instance instanceof Base;

type ReactToolkitConfig = {
  customComponents?: PreparedCustomComponents<any>;
};

const hostConfig = ({
  customComponents,
}: ReactToolkitConfig): LightDeskHostConfig => ({
  supportsMutation: true,
  supportsPersistence: false,
  noTimeout: -1,
  isPrimaryRenderer: true,
  supportsHydration: false,

  afterActiveInstanceBlur: () => null,
  appendChild: (parentInstance, child) => {
    if (parentInstance instanceof BaseParent) {
      parentInstance.appendChild(child);
    } else {
      throw new Error(`Unexpected Parent: ${parentInstance}`);
    }
  },
  appendInitialChild: (parentInstance, child) => {
    if (parentInstance instanceof BaseParent) {
      parentInstance.appendChild(child);
    } else {
      throw new Error(`Unexpected Parent: ${parentInstance}`);
    }
  },
  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  beforeActiveInstanceBlur: () => null,
  cancelTimeout: (id) => clearTimeout(id),
  clearContainer: (container) => container.removeAllChildren(),
  commitMount: () => {
    throw new Error(`Unexpected call to commitMount()`);
  },
  commitUpdate(
    instance,
    updatePayload,
    _type,
    _prevProps,
    _nextProps,
    _internalHandle,
  ) {
    if (canSetProps(instance)) {
      instance.setProps(updatePayload);
    } else {
      throw new Error(`Unexpected Instance: ${instance}`);
    }
  },
  commitTextUpdate: (textInstance, _oldText, newText) =>
    textInstance.setText(newText),
  createInstance: (type, props) => {
    let instance: ld.Component | null = null;
    if (isType('button', type, props)) {
      instance = new ld.Button(props);
    } else if (isType('group', type, props)) {
      instance = new ld.Group(props);
    } else if (isType('group-header', type, props)) {
      instance = new ld.GroupHeader(props);
    } else if (isType('label', type, props)) {
      instance = new ld.Label(props);
    } else if (isType('rect', type, props)) {
      instance = new ld.Rect(props);
    } else if (isType('slider-button', type, props)) {
      instance = new ld.SliderButton(props);
    } else if (isType('switch', type, props)) {
      instance = new ld.Switch(props);
    } else if (isType('tab', type, props)) {
      instance = new ld.Tab(props);
    } else if (isType('tabs', type, props)) {
      instance = new ld.Tabs(props);
    } else if (isType('text-input', type, props)) {
      instance = new ld.TextInput(props);
    } else if (isType('timeline', type, props)) {
      instance = new ld.Timeline(props);
    } else if (type.startsWith(CUSTOM_PREFIX)) {
      const typeName = type.substring(CUSTOM_PREFIX.length);
      if (!customComponents) {
        throw new Error(
          `Unable to render <${typeName} />, no custom components provided to renderer.`,
        );
      }
      const creator = customComponents._creators[typeName];
      if (!creator) {
        throw new Error(
          `Unable to render <${typeName} />, not provided to renderer.`,
        );
      }
      instance = creator(props);
    }
    if (instance) {
      return instance;
    } else {
      throw new Error(`Not implemented type: ${type}`);
    }
  },
  createTextInstance: (text) => new ld.Label({ text }),
  detachDeletedInstance: () => null,
  getChildHostContext: (parentHostContext) => parentHostContext,
  getCurrentEventPriority: () => DefaultEventPriority,
  getInstanceFromNode: () => {
    throw new Error('Not yet implemented.');
  },
  getInstanceFromScope: () => {
    throw new Error('Not yet implemented.');
  },
  getPublicInstance: (instance) => instance,
  getRootHostContext: () => null,
  insertBefore: (parentInstance, child, beforeChild) => {
    if (parentInstance instanceof BaseParent) {
      parentInstance.insertBefore(child, beforeChild);
    } else {
      throw new Error(`Unexpected Parent: ${parentInstance}`);
    }
  },
  insertInContainerBefore: (container, child, beforeChild) =>
    container.insertBefore(child, beforeChild),
  finalizeInitialChildren: () => false,
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  prepareScopeUpdate: () => null,
  prepareUpdate: (
    _instance,
    _type,
    _oldProps,
    newProps,
    _rootContainer,
    _hostContext,
  ) => {
    const updates: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(newProps)) {
      // Filter out extra props from set properties
      if (key !== 'children') {
        updates[key] = val;
      }
    }
    if (Object.keys(updates).length) {
      return updates;
    } else {
      return null;
    }
  },
  removeChild(parentInstance, child) {
    if (parentInstance instanceof BaseParent) {
      parentInstance.removeChild(child);
    } else {
      throw new Error(`Unexpected Parent: ${parentInstance}`);
    }
  },
  removeChildFromContainer: (container, child) => container.removeChild(child),
  resetAfterCommit: () => null,
  resetTextContent: () => {
    throw new Error(`Unexpected call to resetTextContent()`);
  },
  scheduleTimeout: (fn, delay) => setTimeout(fn, delay),
  shouldSetTextContent: () => false,

  // Not-implemented
  hideInstance: () => {
    // eslint-disable-next-line no-console
    console.log('Not-implemented: hideInstance');
  },
  hideTextInstance: () => {
    // eslint-disable-next-line no-console
    console.log('Not-implemented: hideTextInstance');
  },
  unhideInstance: () => {
    // eslint-disable-next-line no-console
    console.log('Not-implemented: unhideInstance');
  },
  unhideTextInstance: () => {
    // eslint-disable-next-line no-console
    console.log('Not-implemented: unhideTextInstance');
  },
});

export const ToolkitRenderer = {
  renderGroup: (
    component: JSX.Element,
    container: ld.Group,
    config: ReactToolkitConfig = {},
  ) => {
    const reconciler = Reconciler(hostConfig(config) as LightDeskHostConfig);
    const root = (reconciler as any).createContainer(container, 0, false, null);
    const componentWithContexts = (
      <LoggerContext.Provider value={container.log}>
        {component}
      </LoggerContext.Provider>
    );
    reconciler.updateContainer(componentWithContexts, root, null);
  },
  render: (
    component: JSX.Element,
    container: ld.Toolkit,
    rootGroupProps?: GroupProps,
    config: ReactToolkitConfig = {},
  ) => {
    const group = new ld.Group({ direction: 'vertical', ...rootGroupProps });
    container.setRoot(group);
    ToolkitRenderer.renderGroup(component, group, config);
  },
};
