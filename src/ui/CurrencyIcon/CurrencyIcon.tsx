'use client';

import { CryptoIcon as CryptoIconOriginal } from '@mxck/react-crypto-icon';
import Image, { StaticImageData } from 'next/image';
import bnbIcon from '~/assets/networkIcons/bnb.svg?url';
import moonbeamIcon from '~/assets/networkIcons/moonbeam.svg?url';
import polygonIcon from '~/assets/networkIcons/polygon.svg?url';
import { Currency, getCurrencyKey, isToken } from '~/lib/currency';
import { NETWORK, Network } from '~/lib/network';
import { USDCx } from '~/lib/tokens';
import { LPTokenIcon } from '../LPTokenIcon';
import busdImage from './busd.png';
import usdcXImage from './usdc-x.png';

interface Props {
  className?: string;
  currency: Currency;
  size?: number;
}

const NETWORK_MAP: Partial<Record<Network, string>> = {
  [NETWORK.bnb]: 'smartchain',
  [NETWORK.avalanche]: 'avalanchec',
  [NETWORK.polygon]: 'polygon',
  [NETWORK.ethereum]: 'ethereum',
  [NETWORK.arbitrum]: 'arbitrum',
};

const CUSTOM_ICONS: Record<string, StaticImageData | string> = {
  [getCurrencyKey(USDCx)]: usdcXImage,
  [NETWORK.bnbTestnet]: bnbIcon, // @@
  [NETWORK.polygonMumbai]: polygonIcon, /// @@
  [NETWORK.moonbeam]: moonbeamIcon, // @@
  [`${NETWORK.avalanche}:0x9c9e5fd8bbc25984b178fdce6117defa39d2db39`]: busdImage, // @@
};

export function CurrencyIcon({ className, currency, size = 32 }: Props): JSX.Element {
  const icon = CUSTOM_ICONS[getCurrencyKey(currency)];
  if (icon) {
    return (
      <Image className={className} src={icon} alt={currency.symbol} width={size} height={size} />
    );
  }

  // @@
  if (currency.symbol === '88X LP') {
    return <LPTokenIcon className={className} width={size} height={size} />;
  }

  const correctedChain = NETWORK_MAP[currency.network];

  if (!correctedChain) {
    return <div className={className} />; // @@
  }

  const address = isToken(currency) ? currency.address : undefined;

  return (
    <CryptoIconOriginal
      key={getCurrencyKey(currency)}
      className={className}
      loading="lazy"
      chain={correctedChain}
      address={address}
      size={size}
    />
  );
}
