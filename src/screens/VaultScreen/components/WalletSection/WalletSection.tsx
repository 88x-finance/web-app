'use client';

import { useAccount } from 'wagmi';
import { LocalVaultAddress, VaultAddress } from '~/lib/vault';
import { ConnectWalletCard } from './ConnectWalletCard';
import { WalletConnected } from './WalletConnected';

interface Props {
  mainVault: VaultAddress;
  localVaults: LocalVaultAddress[];
}

export function WalletSection({ mainVault, localVaults }: Props): JSX.Element {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectWalletCard />;
  }

  return <WalletConnected mainVault={mainVault} localVaults={localVaults} />;
}
