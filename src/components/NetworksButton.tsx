'use client';

import { ConnectButton as ConnectButtonPrimitive } from '@rainbow-me/rainbowkit';
import { ArrowDown2 } from 'iconsax-react';
import Image from 'next/image';

interface Props {
  className?: string;
}

export function NetworksButton({ className }: Props): JSX.Element | null {
  return (
    <ConnectButtonPrimitive.Custom>
      {({ account, chain, openChainModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (!connected) {
          return null;
        }

        if (chain.unsupported) {
          return (
            <button className="flex items-center" onClick={openChainModal} type="button">
              Wrong network <ArrowDown2 className="ml-4" size="10" />
            </button>
          );
        }

        return (
          <button onClick={openChainModal} className="flex items-center justify-center">
            {chain.hasIcon && chain.iconUrl && (
              <div
                className="mr-6 h-18 w-18 overflow-hidden rounded-full"
                style={{ background: chain.iconBackground }}
              >
                <Image
                  alt={chain.name ?? 'Chain icon'}
                  src={chain.iconUrl}
                  className="h-full w-full"
                  width={18}
                  height={18}
                />
              </div>
            )}

            <div className="max-w-[6.25rem] truncate">{chain.name}</div>

            <ArrowDown2 className="ml-4" size="10" />
          </button>
        );
      }}
    </ConnectButtonPrimitive.Custom>
  );
}
