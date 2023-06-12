import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { Address, erc20ABI, readContracts, useAccount, useBalance, useBlockNumber } from 'wagmi';
import { Currency, getCurrencyKey, isToken, NativeToken, Token } from '~/lib/currency';
import { networkToChainId } from '~/lib/network';
import { ethersKeys } from '~/lib/queryKeys';

type BalancesMap = Map<string, BigNumber>;

interface Result extends Omit<UseQueryResult<BalancesMap, unknown>, 'data'> {
  balances: BalancesMap;
}

export async function fetchBalances(
  accountAddress: Address,
  tokens: Token[],
): Promise<BalancesMap> {
  const readResults = await readContracts({
    allowFailure: true,
    contracts: tokens.map(
      ({ address, network }) =>
        ({
          address: address as Address,
          functionName: 'balanceOf',
          args: [accountAddress],
          chainId: networkToChainId(network),
          abi: erc20ABI,
        } as const),
    ),
  });

  const balancesMap: BalancesMap = new Map();
  readResults.forEach((balance, index) => {
    if (balance === null || balance.eq(0)) {
      return;
    }

    const tokenKey = getCurrencyKey(tokens[index]);
    balancesMap.set(tokenKey, balance);
  });

  return balancesMap;
}

export function useQueryBalances(currencies: Currency[]): Result {
  const { address } = useAccount();

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { native, tokens } = useMemo(() => {
    const native: NativeToken[] = [];
    const tokens: Token[] = [];

    for (const currency of currencies) {
      if (isToken(currency)) {
        tokens.push(currency);
      } else {
        native.push(currency);
      }
    }

    return { native, tokens };
  }, [currencies]);

  const { data: nativeBalance } = useBalance({
    address,
    enabled: !!native,
    watch: true,
  });

  const {
    data: balances,
    isInitialLoading,
    ...queryResult
  } = useQuery({
    queryKey: ethersKeys.balances(address, blockNumber, tokens),
    queryFn: () => {
      if (!address) {
        return new Map() as BalancesMap;
      }

      return fetchBalances(address, tokens);
    },
    enabled: !!address && !!blockNumber,
    keepPreviousData: true,
  });

  const balancesMap: BalancesMap = useMemo(() => {
    if (isInitialLoading) {
      return new Map();
    }

    const balancesMap = new Map<string, BigNumber>(balances);

    if (native.length && nativeBalance) {
      balancesMap.set(getCurrencyKey(native[0]), nativeBalance.value);
    }

    return balancesMap;
  }, [isInitialLoading, balances, nativeBalance, native]);

  return { balances: balancesMap, isInitialLoading, ...queryResult };
}
