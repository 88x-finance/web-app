import { useQuery } from '@tanstack/react-query';
import { Network, networkToChainId } from '~/lib/network';
import { apiKeys } from '~/lib/queryKeys';

export function useQueryTokenPrices(network: Network) {
  const chainId = networkToChainId(network);

  return useQuery({
    queryKey: apiKeys.tokenPrices(chainId),
    queryFn: async () => {
      const response = await fetch(`https://token-price.sushi.com/v0/${chainId}`);
      return response.json() as Promise<Record<string, number>>;
    },
    enabled: !!chainId,
  });
}
