'use client';

import { BigNumber } from 'ethers';
import { Address, useContractReads } from 'wagmi';
import { MAIN_VAULT_ABI } from '~/abi/mainVaultAbi';
import { NetworkBadge } from '~/components/NetworkBadge';
import { classNames } from '~/lib/classNames';
import { getNetworkName, Network, NETWORK, networkToChainId } from '~/lib/network';
import { Vault } from '~/lib/vault';
import { Details } from '~/ui/Details';
import { AddressLink } from './AddressLink';
import { DetailsStatusItem } from './DetailsStatusItem';

interface Props {
  className?: string;
  vault: Vault;
}

const CHAIN_NAMES: Record<Network, string> = {
  [NETWORK.bnbTestnet]: 'binance',
  [NETWORK.avalanche]: 'Avalanche',
  [NETWORK.bnb]: 'binance',
  [NETWORK.ethereum]: 'Ethereum',
  [NETWORK.avalanche]: 'Avalanche',
  [NETWORK.moonbeam]: 'Moonbeam',
  [NETWORK.polygon]: 'Polygon',
  [NETWORK.polygonMumbai]: 'Polygon',
  [NETWORK.arbitrum]: 'arbitrum',
};

export function MainVaultStatusCard({ className, vault }: Props): JSX.Element {
  const {
    contract: { address, network },
    networks,
  } = vault;

  const contract = {
    address: address as Address,
    chainId: networkToChainId(network),
    abi: MAIN_VAULT_ABI,
  };

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: 'calculateChainsAmount',
      },
      ...networks.map((network) => ({
        ...contract,
        functionName: 'chainToAmount',
        args: [CHAIN_NAMES[network.network]],
      })),
    ],
    watch: true,
  });

  const [totalBalance, ...networkBalances] = (data as BigNumber[]) ?? [];

  return (
    <div className={classNames('flex flex-col rounded-30 bg-white p-20 shadow', className)}>
      <div className="mb-10 flex items-center justify-between gap-8">
        <NetworkBadge network={network} />
        <AddressLink address={address} network={network} />
      </div>
      <Details>
        <DetailsStatusItem
          title="Total balance"
          method="calculateChainsAmount()"
          isLoading={isLoading}
          value={totalBalance}
        />
        {networks.map((vaultNetwork, index) => (
          <DetailsStatusItem
            key={vaultNetwork.network}
            title={`${getNetworkName(vaultNetwork.network)} balance`}
            method={`chainToAmount("${CHAIN_NAMES[vaultNetwork.network]}")`}
            isLoading={isLoading}
            value={networkBalances[index]}
          />
        ))}
      </Details>
    </div>
  );
}
