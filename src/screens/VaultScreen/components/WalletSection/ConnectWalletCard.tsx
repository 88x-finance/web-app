'use client';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { EmptyWallet } from 'iconsax-react';
import { Button } from '~/ui/Button';

export function ConnectWalletCard(): JSX.Element {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex flex-col items-center justify-center rounded-30 bg-white px-22 pt-42 pb-40 shadow lg:pt-92 lg:pb-90">
      <div className="grid h-48 w-48 place-items-center rounded-2xl border border-dark-6">
        <EmptyWallet size={24} />
      </div>
      <div className="mt-16 max-w-md text-center text-sm text-dark-4">
        Connecting your wallet is like “logging&#160;in” to Web3. Select your wallet from the
        options to get started.
      </div>
      <Button onClick={openConnectModal} className="mt-24" variant="dark">
        Connect wallet
      </Button>
    </div>
  );
}
