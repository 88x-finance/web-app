import { useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount, useContractRead } from 'wagmi';
import { MAIN_VAULT_ABI } from '~/abi/mainVaultAbi';
import { useCurrencyBalance } from '~/hooks/useCurrencyBalance';
import { Token } from '~/lib/currency';
import { formatUSD } from '~/lib/formatters';
import { networkToChainId } from '~/lib/network';
import { graphKeys } from '~/lib/queryKeys';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';
import { Stat } from '~/ui/Stat';

interface Props {
  mainVaultToken: Token;
}

export function Deposited({ mainVaultToken }: Props): JSX.Element {
  const client = useQueryClient();
  const { address } = useAccount();

  const { data: balance } = useCurrencyBalance({
    address,
    currency: mainVaultToken,
    watch: true,
  });

  const { data: inUSDC } = useContractRead({
    address: mainVaultToken?.address,
    abi: MAIN_VAULT_ABI,
    chainId: networkToChainId(mainVaultToken.network),
    functionName: 'calculateAmountForWithdraw',
    args: balance && [balance.value],
    onSuccess: () => {
      client.invalidateQueries(graphKeys.totalProfit(address));
    },
    enabled: !!balance,
  });

  const formattedAmount = formatUSD(inUSDC ?? BigNumber.from('0'), LP_TOKEN_DECIMALS, 2);
  const formattedProfit = formatUSD(BigNumber.from('0'), LP_TOKEN_DECIMALS, 2);

  return (
    <div className="grid grid-cols-2 items-end gap-20 rounded-30 bg-white p-24 shadow">
      <Stat
        size="lg"
        value={formattedAmount}
        title="Your deposit"
        helpText="The deposit value shows the value of your current investments into the 88x’ vault in USD equivalent."
      />
      <Stat
        size="lg"
        variant="secondary"
        value={formattedProfit}
        title="Total Profit"
        helpText="The total profit is the investment income in USD equivalent earned for the entire investment period."
      />
    </div>
  );
}
