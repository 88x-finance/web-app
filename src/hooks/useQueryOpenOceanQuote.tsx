import { useQuery } from '@tanstack/react-query';
import { Hash } from '@wagmi/core';
import { BigNumber, utils } from 'ethers';
import { useMemo } from 'react';
import { Currency, isToken, Token } from '~/lib/currency';
import { MULTICALL_ROUTER } from '~/lib/multicallRouter';
import { NETWORK, Network } from '~/lib/network';
import { openOceanKeys } from '~/lib/queryKeys';

interface Props {
  inToken: Currency;
  outToken: Token;
  amountBN?: BigNumber;
  enabled?: boolean;
}

interface OpenOceanQuote {
  inAmount: string;
  outAmount: string;
  data: Hash;
}

const NETWORK_TO_OPENOCEAN_CHAIN: Partial<Record<Network, string>> = {
  [NETWORK.bnb]: 'bsc',
  [NETWORK.ethereum]: 'eth',
  [NETWORK.polygon]: 'polygon',
  [NETWORK.avalanche]: 'avax',
  [NETWORK.arbitrum]: 'arbitrum',
};

const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export function useQueryOpenOceanQuote({ inToken, outToken, amountBN, enabled = true }: Props) {
  const inTokenAddress = isToken(inToken) ? inToken.address : NATIVE_TOKEN_ADDRESS;

  const parsedAmount = useMemo(() => {
    if (!amountBN || amountBN.eq(0)) {
      return;
    }

    return utils.formatUnits(amountBN?.toString() ?? '0', inToken.decimals);
  }, [amountBN, inToken]);

  return useQuery({
    queryKey: openOceanKeys.swapQuote(
      inToken.network,
      inTokenAddress,
      outToken.address,
      parsedAmount ?? '0',
    ),
    queryFn: async () => {
      if (!parsedAmount) {
        throw new Error('No amount');
      }

      const chain = NETWORK_TO_OPENOCEAN_CHAIN[inToken.network];
      if (!chain) {
        throw new Error('Unsupported network');
      }

      const multicallRouter = MULTICALL_ROUTER[inToken.network];
      if (!multicallRouter) {
        throw new Error('No multicall router address found');
      }

      const url = new URL(`https://open-api.openocean.finance/v3/${chain}/swap_quote`);
      url.searchParams.set('inTokenAddress', inTokenAddress);
      url.searchParams.set('outTokenAddress', outToken.address);
      url.searchParams.set('amount', parsedAmount);
      url.searchParams.set('gasPrice', '5');
      url.searchParams.set('slippage', '1');
      url.searchParams.set('account', multicallRouter.router);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const json = await response.json();

      return json.data as OpenOceanQuote;
    },
    enabled: !!parsedAmount && enabled,
  });
}
