import { cva } from 'class-variance-authority';
import { classNames } from '~/lib/classNames';
import { NETWORK, Network } from '~/lib/network';
import { LPTokenIcon } from '~/ui/LPTokenIcon';
import { NetworkIcon } from '~/ui/NetworkIcon';

import Arrow from './arrow.svg';

interface Props {
  className?: string;
  network: Network;
  txType: 'deposit' | 'withdraw';
}

const border = cva<{
  network: Record<Network, string>;
  txType: Record<'deposit' | 'withdraw', string>;
}>('h-px to-brand bg-gradient-to-r flex-1 progress-line-mask', {
  variants: {
    network: {
      [NETWORK.ethereum]: 'from-ethereum',
      [NETWORK.bnb]: 'from-bnb',
      [NETWORK.polygon]: 'from-polygon',
      [NETWORK.avalanche]: 'from-avalanche',
      [NETWORK.polygonMumbai]: 'from-polygon',
      [NETWORK.bnbTestnet]: 'from-bnb',
      [NETWORK.moonbeam]: 'from-moonbeam',
      [NETWORK.arbitrum]: 'from-arbitrum',
    },
    txType: {
      deposit: 'bg-gradient-to-r',
      withdraw: 'bg-gradient-to-l',
    },
  },
});

export function DirectionIcons({ className, network, txType }: Props): JSX.Element {
  return (
    <div
      className={classNames(
        'flex items-center gap-16',
        txType === 'withdraw' && 'flex-row-reverse',
        className,
      )}
    >
      <NetworkIcon network={network} className="h-36 w-36 rounded-full" />

      <div className={border({ network, txType })} />

      <LPTokenIcon className="h-36 w-36 rounded-full" />

      <Arrow className="absolute left-1/2 -translate-x-1/2 drop-shadow" />
    </div>
  );
}
