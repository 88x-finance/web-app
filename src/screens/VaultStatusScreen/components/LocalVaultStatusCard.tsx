'use client';

import { BigNumber } from 'ethers';
import { Address, useContractReads } from 'wagmi';
import { LOCAL_VAULT_ABI } from '~/abi/localVaultAbi';
import { NetworkBadge } from '~/components/NetworkBadge';
import { networkToChainId } from '~/lib/network';
import { VaultNetwork } from '~/lib/vault';
import { Details } from '~/ui/Details';
import { AddressLink } from './AddressLink';
import { DetailsStatusItem } from './DetailsStatusItem';

interface Props {
  vaultNetwork: VaultNetwork;
}

export function LocalVaultStatusCard({ vaultNetwork }: Props): JSX.Element {
  const { contractAddress, network, strategies } = vaultNetwork;

  const contract = {
    address: contractAddress as Address,
    chainId: networkToChainId(network),
    abi: LOCAL_VAULT_ABI,
  };

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: 'balance',
      },
      {
        ...contract,
        functionName: 'balanceOfLocalVault',
      },
      {
        ...contract,
        functionName: 'mainVaultInfo',
      },
      ...strategies.map((strategy) => ({
        ...contract,
        functionName: 'balanceOfStrategy',
        args: [strategy.name],
      })),
    ],
    watch: true,
  });

  const [balance, balanceOfLocalVault, mainVaultInfo, ...strategiesStatus] =
    (data as (BigNumber | undefined)[]) ?? [];

  return (
    <div className="flex flex-col rounded-30 bg-white p-20 shadow">
      <div className="mb-10 flex items-center justify-between gap-8">
        <NetworkBadge network={network} />
        <AddressLink address={contractAddress} network={network} />
      </div>
      <Details>
        <DetailsStatusItem
          isLoading={isLoading}
          method="balance()"
          title="Balance"
          value={balance}
        />
        <DetailsStatusItem
          isLoading={isLoading}
          method="balanceOfLocalVault()"
          title="Free balance on the vault"
          value={balanceOfLocalVault}
        />
        <DetailsStatusItem
          isLoading={isLoading}
          method="mainVaultInfo()"
          title="Main vault information"
          value={mainVaultInfo}
        />
        {strategies.map((strategy, index) => (
          <DetailsStatusItem
            key={strategy.id}
            value={strategiesStatus[index]}
            isLoading={isLoading}
            method={`balanceOfStrategy("${strategy.name}")`}
            title={`Balance of ${strategy.name}`}
          />
        ))}
      </Details>
    </div>
  );
}
