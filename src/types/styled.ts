import React from 'react';

export function styled<
  T extends
    | keyof JSX.IntrinsicElements
    | React.FunctionComponent<Props>
    | React.ForwardRefExoticComponent<Props>,
  Element = T extends keyof React.ReactHTML
    ? React.ReactHTML[T] extends React.DetailedHTMLFactory<any, infer U>
      ? U
      : never
    : T extends React.ForwardRefExoticComponent<unknown & React.RefAttributes<infer U>>
    ? U
    : T extends React.FunctionComponent
    ? ReturnType<T>
    : never,
  Props extends { className?: string } = T extends keyof React.ReactHTML
    ? React.ReactHTML[T] extends React.DetailedHTMLFactory<infer U, any>
      ? U
      : never
    : T extends React.ForwardRefExoticComponent<infer U>
    ? U
    : T extends React.FunctionComponent<infer U>
    ? U
    : never,
>(component: T, className: string | ((props: Props) => string)) {
  // eslint-disable-next-line react/display-name
  const Component = React.forwardRef<Element, Props>((props, ref) => {
    let componentClassName: string;
    if (typeof className === 'function') {
      componentClassName = className(props);
    } else {
      componentClassName = className;
    }

    return React.createElement(component, {
      ...props,
      ref,
      className: `${componentClassName} ${props.className ?? ''}`.trim(),
    });
  });

  const displayName =
    typeof component === 'string' ? `${styled}.${component}` : `Styled${component.displayName}`;

  Component.displayName = displayName;

  return Component;
}
