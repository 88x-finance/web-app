'use client';

import { useNetwork } from 'wagmi';
import { NetworksButton } from '~/components/NetworksButton';
import { chainIdToNetwork } from '~/lib/network';
import { createLPToken } from '~/lib/tokens';
import { LocalVaultAddress, VaultAddress } from '~/lib/vault';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/Tabs';
import { Deposit } from './Deposit';
import { Deposited } from './Deposited';
import { UnsupportedNetwork } from './UnsupportedNetwork';
import { Withdraw } from './Withdraw';

interface Props {
  mainVault: VaultAddress;
  localVaults: LocalVaultAddress[];
}

export function WalletConnected({ mainVault, localVaults }: Props): JSX.Element {
  const { chain } = useNetwork();
  const network = chain ? chainIdToNetwork(chain.id) : undefined;

  const mainVaultToken = createLPToken(mainVault.network, mainVault.address);

  const localVault = localVaults.find((vault) => vault.network === network);

  return (
    <div className="flex flex-col gap-30">
      <Deposited mainVaultToken={mainVaultToken} />

      <Tabs defaultValue="deposit" className="flex flex-col rounded-30 bg-white p-24 shadow">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        <div className="mt-20 flex items-center justify-between gap-8">
          <div className="text-dark-4">Network:</div>
          <NetworksButton />
        </div>

        <TabsContent value="deposit" className="mt-16">
          {localVault ? (
            <Deposit mainVaultToken={mainVaultToken} localVault={localVault} />
          ) : (
            <UnsupportedNetwork localVaults={localVaults} />
          )}
        </TabsContent>
        <TabsContent value="withdraw" className="mt-16">
          {localVault ? (
            <Withdraw
              mainVaultToken={mainVaultToken}
              localVault={localVault}
              localVaults={localVaults}
              mainVault={mainVault}
            />
          ) : (
            <UnsupportedNetwork localVaults={localVaults} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
