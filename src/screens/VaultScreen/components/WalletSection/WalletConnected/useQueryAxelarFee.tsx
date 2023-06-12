import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { Network } from '~/lib/network';
import { apiKeys } from '~/lib/queryKeys';

export function useQueryAxelarFee(fromNetwork: Network, toNetwork: Network) {
  return useQuery({
    queryKey: apiKeys.axelarFee(fromNetwork, toNetwork),
    queryFn: async () => {
      const response = await fetch(
        `/api/axelar/fee?fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
      );

      const { fee } = await response.json();

      return BigNumber.from(fee);
    },
  });
}
