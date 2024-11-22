import {
  AnyComponent,
  Base,
  BaseParent,
} from '@arcanejs/toolkit/components/base';
import React from 'react';

export type ComponentRegister = {
  [type: string]: {
    create: (props: { [key: string]: any }) => AnyComponent;
  };
};

type ComponentClass = new (...args: any[]) => AnyComponent;

type ComponentsDefinition = {
  [key: string]: ComponentClass;
};

type Child = JSX.Element | null | undefined | false | string;

type Children = Child | Child[];

type PropsOfComponent<T extends ComponentClass> =
  // All props optional (with children)
  T extends new (props?: infer P) => BaseParent<any, any, any>
    ? Partial<P & { children: Children }>
    : // Some props required (with children)
      T extends new (props: infer P) => BaseParent<any, any, any>
      ? P & { children?: Children }
      : // All props optional
        T extends new (props?: infer P) => Base<any, any, any>
        ? Partial<P>
        : // Some props required
          T extends new (props: infer P) => Base<any, any, any>
          ? P
          : never;

type InstanceType<T extends ComponentClass> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : never;

type Creators<D extends ComponentsDefinition> = {
  [K in keyof D]: (props: { [key: string]: any }) => AnyComponent;
};

type ComponentFunctionForComponent<T extends ComponentClass> =
  React.ForwardRefExoticComponent<
    React.PropsWithoutRef<PropsOfComponent<T>> &
      React.RefAttributes<InstanceType<T>>
  >;

type ComponentFunctions<D extends ComponentsDefinition> = {
  [K in keyof D]: ComponentFunctionForComponent<D[K]>;
};

export type PreparedComponents<D extends ComponentsDefinition> = {
  _namespace: string;
  _creators: Creators<D>;
} & ComponentFunctions<D>;

export const prepareComponents = <D extends ComponentsDefinition>(
  namespace: string,
  defn: D,
): PreparedComponents<D> => {
  const entries = Object.entries(defn) as [keyof D & string, D[keyof D]][];

  const _creators = entries.reduce<Creators<D>>((acc, [key, cls]) => {
    acc[key] = (props: { [key: string]: any }) => new cls(props);
    return acc;
  }, {} as Creators<D>);

  const components = entries.reduce<ComponentFunctions<D>>(
    (acc, [key, cls]) => {
      acc[key] = React.forwardRef((props, ref) =>
        React.createElement(
          `${namespace}:${key}`,
          { ...props, ref },
          props.children,
        ),
      ) as ComponentFunctionForComponent<typeof cls>;
      return acc;
    },
    {} as ComponentFunctions<D>,
  );

  return {
    _namespace: namespace,
    _creators,
    ...components,
  };
};
