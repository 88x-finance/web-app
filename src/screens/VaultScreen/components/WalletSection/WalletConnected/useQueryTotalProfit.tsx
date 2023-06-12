import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import type { Address } from 'wagmi';
import { graphKeys } from '~/lib/queryKeys';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';

interface GraphResponse {
  data: {
    account: {
      lpBalance: string;
      usdNetDeposits: string;
    } | null;
    rate: {
      value: string;
    };
  };
}

const GRAPH_URL = process.env.NEXT_PUBLIC_ENVIRONMENT
  ? 'https://api.thegraph.com/subgraphs/name/mxck/main-vault-moonbeam'
  : 'https://api.thegraph.com/subgraphs/name/mxck/main-vault-mumbai';

export function useQueryTotalProfit(address?: Address) {
  return useQuery({
    queryKey: graphKeys.totalProfit(address),
    queryFn: async () => {
      const response = await fetch(GRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query($id: ID) {
              rate(id: "latest") {
                value
              }
              account(id: $id) {
                lpBalance
                usdNetDeposits
              }
            }`,
          variables: {
            id: address,
          },
        }),
      });

      const { data } = (await response.json()) as GraphResponse;

      if (!data.account) {
        return BigNumber.from(0);
      }

      const { lpBalance, usdNetDeposits } = data.account;
      const { value: rate } = data.rate;

      const totalProfit = BigNumber.from(lpBalance)
        .mul(BigNumber.from(rate))
        .div(BigNumber.from(10).pow(LP_TOKEN_DECIMALS))
        .sub(BigNumber.from(usdNetDeposits));

      return totalProfit;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!address,
  });
}
