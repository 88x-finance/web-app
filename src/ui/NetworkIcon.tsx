import { default as ArbitrumIcon } from '~/assets/networkIcons/arbitrum.svg';
import { default as AvalancheIcon } from '~/assets/networkIcons/avalanche.svg';
import { default as BNBIcon } from '~/assets/networkIcons/bnb.svg';
import { default as EthereumIcon } from '~/assets/networkIcons/ethereum.svg';
import { default as Moonbeam } from '~/assets/networkIcons/moonbeam.svg';
import { default as PolygonIcon } from '~/assets/networkIcons/polygon.svg';
import { NETWORK, Network } from '~/lib/network';

interface Props extends React.SVGAttributes<SVGElement> {
  network: Network;
}

export const NETWORK_ICONS_MAP: Readonly<Record<Network, SVGRComponent>> = {
  [NETWORK.ethereum]: EthereumIcon,
  [NETWORK.bnb]: BNBIcon,
  [NETWORK.avalanche]: AvalancheIcon,
  [NETWORK.polygon]: PolygonIcon,
  [NETWORK.polygonMumbai]: PolygonIcon,
  [NETWORK.bnbTestnet]: BNBIcon,
  [NETWORK.moonbeam]: Moonbeam,
  [NETWORK.arbitrum]: ArbitrumIcon,
};

export function NetworkIcon({ network, ...props }: Props): JSX.Element {
  const Icon = NETWORK_ICONS_MAP[network];

  return <Icon {...props} />;
}
