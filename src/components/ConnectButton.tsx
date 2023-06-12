'use client';

import { ConnectButton as ConnectButtonPrimitive } from '@rainbow-me/rainbowkit';
import { ArrowDown2, EmptyWallet } from 'iconsax-react';
import { classNames } from '~/lib/classNames';
import { Button } from '~/ui/Button';
import { NetworksButton } from './NetworksButton';

interface Props {
  className?: string;
}

export function ConnectButton({ className }: Props): JSX.Element {
  return (
    <ConnectButtonPrimitive.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        let content;
        if (!connected) {
          content = (
            <Button onClick={openConnectModal} type="button">
              Connect wallet
            </Button>
          );
        } else if (chain.unsupported) {
          content = (
            <Button onClick={openChainModal} type="button" variant="dark">
              Wrong network
            </Button>
          );
        } else {
          content = (
            <div className="flex gap-10 md:gap-20 lg:gap-30">
              <NetworksButton />

              <Button onClick={openAccountModal} className="!font-normal" type="button">
                <EmptyWallet className="mr-8 text-dark-4" size={20} />
                {account.displayName}
                <ArrowDown2 className="ml-4" size="10" />
              </Button>
            </div>
          );
        }

        return (
          <div
            aria-hidden={!ready}
            className={classNames(!ready && 'pointer-events-none select-none opacity-0', className)}
          >
            {content}
          </div>
        );
      }}
    </ConnectButtonPrimitive.Custom>
  );
}
