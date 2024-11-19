import { Base as BaseComponent } from '@arcanejs/toolkit/components/base';
import React from 'react';
import { Props } from './types';

export const CUSTOM_PREFIX = 'custom:';

export type CustomComponentRegister = {
  [type: string]: {
    create: (props: { [key: string]: any }) => BaseComponent<Props>;
  };
};

type CustomComponentClass = new (...args: any[]) => BaseComponent<any>;

type CustomComponentsDefinition = {
  [key: string]: CustomComponentClass;
};

type PropsOfComponent<T extends CustomComponentClass> =
  T extends typeof BaseComponent<infer P> ? P : never;

type InstanceType<T extends CustomComponentClass> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : never;

type Creators<D extends CustomComponentsDefinition> = {
  [K in keyof D]: (props: { [key: string]: any }) => BaseComponent<unknown>;
};

type ComponentFunctionForComponent<T extends CustomComponentClass> =
  React.ForwardRefExoticComponent<
    React.PropsWithoutRef<PropsOfComponent<T>> &
      React.RefAttributes<InstanceType<T>>
  >;

type ComponentFunctions<D extends CustomComponentsDefinition> = {
  [K in keyof D]: ComponentFunctionForComponent<D[K]>;
};

export type PreparedCustomComponents<D extends CustomComponentsDefinition> = {
  _creators: Creators<D>;
} & ComponentFunctions<D>;

export const prepareCustomComponents = <D extends CustomComponentsDefinition>(
  defn: D,
): PreparedCustomComponents<D> => {
  const entries = Object.entries(defn) as [keyof D & string, D[keyof D]][];

  const _creators = entries.reduce<Creators<D>>((acc, [key, cls]) => {
    acc[key] = (props: { [key: string]: any }) => new cls(props);
    return acc;
  }, {} as Creators<D>);

  const components = entries.reduce<ComponentFunctions<D>>(
    (acc, [key, cls]) => {
      acc[key] = React.forwardRef((props, ref) =>
        React.createElement(
          `${CUSTOM_PREFIX}${key}`,
          { ...props, ref },
          props.children,
        ),
      ) as ComponentFunctionForComponent<typeof cls>;
      return acc;
    },
    {} as ComponentFunctions<D>,
  );

  return {
    _creators,
    ...components,
  };
};
