import type { GMPStatusResponse } from '@axelar-network/axelarjs-sdk';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useWaitForTransaction } from 'wagmi';
import { getAxelarExplorerUrl, GMPStatus } from '~/lib/axelar';
import { classNames } from '~/lib/classNames';
import { formatAmount } from '~/lib/formatters';
import { getNetworkName, networkToChainId } from '~/lib/network';
import { apiKeys } from '~/lib/queryKeys';
import { StoredTransaction } from '~/lib/storedTransaction';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';
import { Button } from '~/ui/Button';
import { Details, DetailsItem } from '~/ui/Details';
import { DialogTitle } from '~/ui/Dialog';
import { DirectionIcons } from './DirectionDisplay';
import { getTransactionStatusMessage } from './getTransactionStatusMessage';

interface Props {
  transaction: StoredTransaction;
}

const REFETCH_INTERVAL = 5000; // 5 seconds

export function TransactionDetails({ transaction }: Props): JSX.Element {
  const { type, hash, amount, timestamp, network } = transaction;

  const { data: transactionRecipe } = useWaitForTransaction({
    hash,
    chainId: networkToChainId(network),
  });

  const isMined = transactionRecipe?.status === 1;

  const { data: axelarStatusResponse, refetch } = useQuery({
    queryKey: apiKeys.axelarStatus(hash),
    queryFn: async () => {
      const response = await fetch(`/api/axelar/tx-status?hash=${hash}`);

      const data = await response.json();

      return data as GMPStatusResponse;
    },
    enabled: isMined,
  });

  let isAxelarExecuted = false;
  if (axelarStatusResponse) {
    const { status } = axelarStatusResponse;
    isAxelarExecuted =
      status === GMPStatus.DEST_EXECUTED ||
      status === GMPStatus.DEST_EXECUTE_ERROR ||
      status === GMPStatus.UNKNOWN_ERROR;
  }

  useEffect(() => {
    if (!isAxelarExecuted || !isMined) {
      return;
    }

    const interval = window.setInterval(() => {
      refetch();
    }, REFETCH_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [isAxelarExecuted, refetch, isMined]);

  const formattedAmount = useMemo(() => {
    const bn = BigNumber.from(amount);
    return formatAmount(bn, LP_TOKEN_DECIMALS);
  }, [amount]);

  const formattedDateTime = useMemo(() => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US');
  }, [timestamp]);

  const finished = (transactionRecipe && !isMined) || (isAxelarExecuted && isMined);

  return (
    <>
      <DialogTitle>{type === 'deposit' ? 'Deposit details' : 'Withdrawal details'}</DialogTitle>
      <DirectionIcons className="mt-24" network={network} txType={type} />

      <div className="mt-32 text-center">From {getNetworkName(network)} to 88x</div>
      <div className="mt-8 text-center text-sm text-dark-4">
        Waiting to send funds to another network...
      </div>

      <Details className="mt-20">
        <DetailsItem title="Amount">{formattedAmount}</DetailsItem>
        <DetailsItem title="Status">
          <div className={classNames(!finished && 'animate-pulse')}>
            {getTransactionStatusMessage(transactionRecipe, axelarStatusResponse)}
          </div>
        </DetailsItem>
        <DetailsItem title="Date and time">{formattedDateTime}</DetailsItem>
      </Details>

      <Button
        className="mt-20"
        as="a"
        href={getAxelarExplorerUrl(hash)}
        target="_blank"
        rel="noreferrer"
      >
        View Transaction
      </Button>
    </>
  );
}
