interface Props {
  children?: React.ReactNode;
  title: string;
}

export function FilterGroup({ title, children }: Props): JSX.Element {
  return (
    <div>
      <div className="pb-16 text-sm text-dark-5">{title}</div>
      {children}
    </div>
  );
}
