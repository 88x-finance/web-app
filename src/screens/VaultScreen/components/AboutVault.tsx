interface Props {
  children?: React.ReactNode;
}

export function AboutVault({ children }: Props): JSX.Element {
  return (
    <div>
      <div>About vault</div>
      <p className="mt-24 text-sm leading-[140%] text-dark-4">{children}</p>
    </div>
  );
}
