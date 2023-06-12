import { cva } from 'class-variance-authority';
import { getNetworkName, Network, NETWORK } from '~/lib/network';
import { NetworkIcon } from '~/ui/NetworkIcon';

interface Props {
  className?: string;
  network: Network;
}

const container = cva<{ network: Record<Network, string> }>(
  'h-28 px-10 flex items-center gap-6 rounded-50 text-sm',
  {
    variants: {
      network: {
        [NETWORK.ethereum]: 'bg-ethereum/10 text-ethereum',
        [NETWORK.bnb]: 'bg-bnb/10 text-bnb',
        [NETWORK.polygon]: 'bg-polygon/10 text-polygon',
        [NETWORK.avalanche]: 'bg-avalanche/10 text-avalanche',
        [NETWORK.moonbeam]: 'bg-moonbeam/10 text-moonbeam',
        [NETWORK.polygonMumbai]: 'bg-polygon/10 text-polygon',
        [NETWORK.bnbTestnet]: 'bg-bnb/10 text-bnb',
        [NETWORK.arbitrum]: 'bg-arbitrum/10 text-arbitrum',
      },
    },
  },
);

export function NetworkBadge({ network, className }: Props): JSX.Element {
  return (
    <div className={container({ network, className })}>
      <NetworkIcon network={network} className="text-lg" />
      {getNetworkName(network)}
    </div>
  );
}
