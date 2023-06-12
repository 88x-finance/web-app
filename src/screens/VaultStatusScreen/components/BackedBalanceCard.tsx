'use client';

import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { NetworkBadge } from '~/components/NetworkBadge';
import { Token } from '~/lib/currency';
import { formatAmount } from '~/lib/formatters';
import { NETWORK, Network } from '~/lib/network';
import { apiKeys } from '~/lib/queryKeys';
import { NATIVES } from '~/lib/tokens';
import { Details, DetailsItem } from '~/ui/Details';
import { LinearChart } from '~/ui/LinearChart/LinearChart';
import { Separator } from '~/ui/Separator';
import { TokenBadge } from '~/ui/TokenBadge';
import { AddressLink } from './AddressLink';

interface Props {
  network: Network;
  depositToken?: Token;
}

const BACKEND_ADDRESS = '0xCB043faa52c3B5e5012ac80197D316aDE54aF40F';
const NATIVE_TOKEN_ADDRESS = [
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0x0000000000000000000000000000000000001010',
] as const;
const COVALENTHQ_KEY = 'ckey_52c758b674b94fa08b97adf4ddc';

const NETWORK_NAMES: Partial<Record<Network, string>> = {
  [NETWORK.bnb]: 'bsc-mainnet',
  [NETWORK.ethereum]: 'eth-mainnet',
  [NETWORK.polygon]: 'matic-mainnet',
  [NETWORK.avalanche]: 'avalanche-mainnet',
  [NETWORK.moonbeam]: 'moonbeam-mainnet',
  [NETWORK.arbitrum]: 'arbitrum-mainnet',
};

export function BackedBalanceCard({ network, depositToken }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: apiKeys.balanceHistory(BACKEND_ADDRESS, network),
    queryFn: async () => {
      const networkName = NETWORK_NAMES[network];
      if (!networkName) {
        return;
      }

      const response = await fetch(
        `https://api.covalenthq.com/v1/${networkName}/address/${BACKEND_ADDRESS}/portfolio_v2/?key=${COVALENTHQ_KEY}`,
        { headers: { 'Content-Type': 'application/json' } },
      );

      const json = await response.json();

      return json.data;
    },
  });

  const nativeData = data?.items.find((item: any) =>
    NATIVE_TOKEN_ADDRESS.includes(item.contract_address),
  );

  const nativeAmount = BigNumber.from(nativeData?.holdings[0].close.balance ?? '0');
  const nativeToken = NATIVES[network];

  const depositTokenData =
    depositToken &&
    data?.items.find(
      (item: any) => item.contract_address.toLowerCase() === depositToken.address.toLowerCase(),
    );

  const depositTokenAmount = BigNumber.from(depositTokenData?.holdings[0].close.balance ?? '0');

  const nativeChartData = nativeData
    ? Array.from(nativeData.holdings)
        .reverse()
        .map((item: any) => {
          return {
            timestamp: new Date(item.timestamp).getTime(),
            value: Number(formatUnits(BigNumber.from(item.close.balance), nativeToken.decimals)),
          };
        })
    : [];

  return (
    <div className="flex flex-col gap-8 rounded-30 bg-white p-20 shadow">
      <div className="flex items-center justify-between gap-8">
        <NetworkBadge network={network} />
        <AddressLink address={BACKEND_ADDRESS} network={network}>
          Check in explorer
        </AddressLink>
      </div>
      <Details>
        <DetailsItem title="Native token" loading={isLoading}>
          <div className="flex items-center gap-4">
            {formatAmount(nativeAmount, nativeToken.decimals)}
            <TokenBadge className="!bg-gray-7" token={nativeToken} />
          </div>
        </DetailsItem>
        {depositToken && (
          <DetailsItem title="Deposit token" loading={isLoading}>
            <div className="flex items-center gap-4">
              {formatAmount(depositTokenAmount, depositToken.decimals)}
              <TokenBadge className="!bg-gray-7" token={depositToken} />
            </div>
          </DetailsItem>
        )}
      </Details>

      <Separator className="mt-auto" />

      <div className="h-[200px] w-full">
        <LinearChart
          getY={(item: any) => Number(item.value)}
          formatY={(value) => value.toLocaleString()}
          margin={{ left: 40 }}
          data={nativeChartData}
        />
      </div>
    </div>
  );
}
