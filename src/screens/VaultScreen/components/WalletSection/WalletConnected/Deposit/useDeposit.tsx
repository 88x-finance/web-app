import { PrepareWriteContractConfig, PrepareWriteContractResult } from '@wagmi/core';
import { BigNumber } from 'ethers';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { MULTICALL_ROUTER_ABI } from '~/abi/multicallRouter';
import { Currency } from '~/lib/currency';
import { normalizeAmountStoredTransaction, StoredTransaction } from '~/lib/storedTransaction';
import { useTransactionModalStore } from '~/stores/transactionModalStore';
import { useTransactionsStore } from '~/stores/transactionsStore';

interface UseDepositProps {
  config?: PrepareWriteContractConfig;
  amount?: BigNumber;
  currency: Currency;
}

export function useDeposit({ amount, currency, config }: UseDepositProps) {
  const { address } = useAccount();

  const openModal = useTransactionModalStore((state) => state.openModal);
  const addTransaction = useTransactionsStore((state) => state.addTransaction);

  const { config: preparedWriteConfig, isLoading: isPrepareContractLoading } =
    usePrepareContractWrite(config);

  const { write: deposit, isLoading: isWriteLoading } = useContractWrite({
    ...(preparedWriteConfig as PrepareWriteContractResult<
      typeof MULTICALL_ROUTER_ABI,
      'multicallNative'
    >),
    onSuccess: (data) => {
      if (!amount || !address) {
        return;
      }

      const transaction: StoredTransaction = {
        address,
        hash: data.hash,
        type: 'deposit',
        network: currency.network,
        amount: normalizeAmountStoredTransaction(amount, currency.decimals),
        timestamp: Date.now(),
      };

      addTransaction(transaction);
      openModal(transaction);
    },
  });

  return {
    isPending: isWriteLoading,
    deposit,
    isLoading: isPrepareContractLoading,
  };
}
