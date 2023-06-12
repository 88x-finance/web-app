import { Address } from 'wagmi';
import { getAddressExplorerUrl, Network } from '~/lib/network';

interface Props {
  address: Address;
  network: Network;
  children?: React.ReactNode;
}

export function AddressLink({ address, network, children }: Props): JSX.Element {
  return (
    <a
      className="min-w-0 truncate font-mono text-xsm text-blue-500 transition-colors hover:text-blue-700"
      href={getAddressExplorerUrl(network, address)}
      target="_blank"
      rel="noreferrer"
    >
      {children ?? address}
    </a>
  );
}
