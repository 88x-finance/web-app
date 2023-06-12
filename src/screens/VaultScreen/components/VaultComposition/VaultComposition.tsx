interface Props {
  children?: React.ReactNode;
}

export function VaultComposition({ children }: Props): JSX.Element {
  return (
    <div className="@container">
      <div>Vault&apos;s composition</div>
      <div className="mt-30 grid grid-cols-1 gap-30 @2xl:grid-cols-2">{children}</div>
    </div>
  );
}
