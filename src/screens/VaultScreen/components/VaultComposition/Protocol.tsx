import Image from 'next/image';
import type { Address } from 'wagmi';
import { getAddressExplorerUrl, type Network } from '~/lib/network';

interface Props {
  name: string;
  network: Network;
  address: Address;
}

const PROTOCOLS_IMAGES: Record<string, string> = {
  aave: 'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
  alpaca: 'https://s2.coinmarketcap.com/static/img/coins/200x200/8707.png',
  beefy: 'https://s2.coinmarketcap.com/static/img/coins/200x200/7311.png',
  benqi: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9288.png',
  compound: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5692.png',
  convex: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9903.png',
  stargate: 'https://s2.coinmarketcap.com/static/img/coins/200x200/18934.png',
  yearn: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5864.png',
};

export function Protocol({ name, network, address }: Props): JSX.Element {
  return (
    <a
      className="bg-red group -mx-10 flex h-24 items-center gap-4 rounded-50 bg-transparent px-10 text-sm shadow-none transition hover:bg-gray-6 hover:shadow"
      href={getAddressExplorerUrl(network, address)}
      target="_blank"
      rel="noreferrer noopener"
      title="View contract in explorer"
    >
      <Image
        className="h-14 w-14 rounded-full opacity-100 ring-1 ring-gray-6 transition-opacity"
        src={PROTOCOLS_IMAGES[name] ?? ''}
        alt={`${name} logo`}
        width={14}
        height={14}
      />
      <div>{name}</div>
    </a>
  );
}
