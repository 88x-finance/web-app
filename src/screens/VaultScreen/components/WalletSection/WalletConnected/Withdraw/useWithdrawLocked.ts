import { useQueries, useQuery } from '@tanstack/react-query';
import { Address, getContract, getProvider } from '@wagmi/core';
import { BigNumber, Event } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { LOCAL_VAULT_ABI } from '~/abi/localVaultAbi';
import { MAIN_VAULT_ABI } from '~/abi/mainVaultAbi';
import { networkToChainId } from '~/lib/network';
import { graphKeys } from '~/lib/queryKeys';
import { fetchLocalVaultGraph, fetchMainVaultGraph } from '~/lib/theGraph';
import { LocalVaultAddress, VaultAddress } from '~/lib/vault';

interface Params {
  mainVault: VaultAddress;
  localVaults: LocalVaultAddress[];
}

interface ReturnValue {
  locked: boolean;
  isLoading: boolean;
}

const BLOCK_LIMIT = 3000;

function getLocalVaultContract(localVault: LocalVaultAddress) {
  const provider = getProvider({ chainId: networkToChainId(localVault.network) });

  return getContract({
    abi: LOCAL_VAULT_ABI,
    address: localVault.address,
    signerOrProvider: provider,
  });
}

function useGetLastWithdrawRequestEventTimestamp(
  localVaults: LocalVaultAddress[],
  enabled?: boolean,
) {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['lastWithdrawRequestOnchain', address],
    queryFn: async () => {
      if (!address) {
        return 0;
      }

      const requests = await Promise.allSettled(
        localVaults.map(async (localVault) => {
          const contract = getLocalVaultContract(localVault);

          const blockNumber = await contract.provider.getBlockNumber();

          const events = await contract.queryFilter(
            contract.filters.WithdrawRequest(null, null),
            blockNumber - BLOCK_LIMIT,
            'latest',
          );

          const userEvents = events.filter((event) => event.args?.user === address);

          if (!userEvents.length) {
            return null;
          }

          const lastEvent = userEvents[userEvents.length - 1];

          const block = await lastEvent.getBlock();

          return block.timestamp;
        }),
      );

      let maxTimestamp = 0;
      requests.forEach((request) => {
        if (request.status === 'rejected' || !request.value) {
          return;
        }

        if (request.value > maxTimestamp) {
          maxTimestamp = request.value;
        }
      });

      return maxTimestamp;
    },
    enabled,
  });
}

function useGetLastWithdrawTimestampFromEvents(
  localVaults: LocalVaultAddress[],
  enabled?: boolean,
): number {
  const { address } = useAccount();

  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    if (!address || !enabled) {
      return;
    }

    let ignore = false;
    const unsubscribes: (() => void)[] = [];

    for (const localVault of localVaults) {
      const contract = getLocalVaultContract(localVault);

      const listener = (userAddress: Address, _lpAmount: BigNumber, event: Event): void => {
        if (userAddress !== address) {
          // skip if not the current user
          return;
        }

        const getTimestamp = async () => {
          const block = await event.getBlock();
          return block.timestamp;
        };

        getTimestamp()
          .then((timestamp) => {
            if (ignore) {
              return;
            }

            setTimestamp((lastTimestamp) => {
              if (lastTimestamp > timestamp) {
                return lastTimestamp;
              }

              return timestamp;
            });
          })
          .catch(() => {
            // do nothing
          });
      };

      contract.on('WithdrawRequest', listener);

      unsubscribes.push(() => {
        ignore = true;
        contract.off('WithdrawRequest', listener);
      });
    }
  }, [address, localVaults, enabled]);

  return timestamp;
}

// Check if the user has a pending withdraw request
export function useWithdrawLocked({ localVaults, mainVault }: Params): ReturnValue {
  const { address } = useAccount();

  const { data: withdrawRequest, isLoading } = useContractRead({
    abi: MAIN_VAULT_ABI,
    address: mainVault.address,
    chainId: networkToChainId(mainVault.network),
    functionName: 'withdrawRequests',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const lockedOnContract =
    !!withdrawRequest && (withdrawRequest.amount.gt(0) || withdrawRequest.lpAmount.gt(0));

  const { data: lastWithdrawTimestamp, isLoading: lastWithdrawTimestampIsLoading } =
    useGetLastWithdrawRequestEventTimestamp(localVaults, !lockedOnContract);

  const lastWithdrawEventTimestamp = useGetLastWithdrawTimestampFromEvents(
    localVaults,
    !lockedOnContract,
  );

  const { data: lastSatisfyWithdrawTimestamp, isLoading: lastSatisfyWithdrawTimestampIsLoading } =
    useQuery({
      queryKey: graphKeys.satisfyWithdrawsMainVault(mainVault.network, address),
      queryFn: async () => {
        const data = await fetchMainVaultGraph(
          mainVault.network,
          `{ satisfyWithdraws(first: 1, orderBy: blockNumber, orderDirection: desc, where: { user: "${address}"}) { blockTimestamp }}`,
        );

        const timestamp = Number.parseInt(data.satisfyWithdraws[0]?.blockTimestamp);
        return Number.isNaN(timestamp) ? 0 : timestamp;
      },
      staleTime: 5 * 1000, // 10 seconds
      enabled: !lockedOnContract,
    });

  const localVaultQueries = useQueries({
    queries: localVaults.map((localVault) => ({
      queryKey: graphKeys.withdrawRequestsLocalVault(localVault.network, address),
      queryFn: async () => {
        const data = await fetchLocalVaultGraph(
          localVault.network,
          `{ withdrawRequests(first: 1, orderBy: blockNumber, orderDirection: desc, where: { user: "${address}"}) { blockTimestamp }}`,
        );

        const timestamp = Number.parseInt(data.withdrawRequests[0]?.blockTimestamp);
        return Number.isNaN(timestamp) ? 0 : timestamp;
      },
      staleTime: 5 * 1000, // 10 seconds
      enabled: !lockedOnContract,
    })),
  });

  if (lockedOnContract) {
    return {
      locked: true,
      isLoading: false,
    };
  }

  const timestamp = Math.max(
    ...localVaultQueries.map((query) => query.data ?? 0),
    lastWithdrawTimestamp ?? 0,
    lastWithdrawEventTimestamp,
  );

  return {
    locked:
      !!timestamp && !!lastSatisfyWithdrawTimestamp && timestamp > lastSatisfyWithdrawTimestamp,
    isLoading:
      isLoading ||
      lastWithdrawTimestampIsLoading ||
      lastSatisfyWithdrawTimestampIsLoading ||
      localVaultQueries.some((query) => query.isLoading),
  };
}
