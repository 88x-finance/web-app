import { getNetworkName } from '~/lib/network';
import { VaultAddress } from '~/lib/vault';

interface Props {
  localVaults: VaultAddress[];
}

export function UnsupportedNetwork({ localVaults }: Props): JSX.Element {
  const chainNames = localVaults.map((vault) => getNetworkName(vault.network)).join(', ');

  return (
    <div className="my-20 text-center text-dark-4">
      Network is not supported.
      <br />
      Please switch to {chainNames}.
    </div>
  );
}
