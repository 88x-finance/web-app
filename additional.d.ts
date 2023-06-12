type SVGRComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const ReactComponent: SVGRComponent;

  export default ReactComponent;
}

declare module '*.svg?url' {
  const url: string;

  export default url;
}
