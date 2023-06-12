import { useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { LOCAL_VAULT_ABI } from '~/abi/localVaultAbi';
import { Currency } from '~/lib/currency';
import { graphKeys } from '~/lib/queryKeys';
import { normalizeAmountStoredTransaction, StoredTransaction } from '~/lib/storedTransaction';
import { VaultAddress } from '~/lib/vault';
import { useTransactionModalStore } from '~/stores/transactionModalStore';
import { useTransactionsStore } from '~/stores/transactionsStore';
import { useQueryAxelarFee } from '../useQueryAxelarFee';

interface WithdrawProps {
  localVault: VaultAddress;
  mainVault: VaultAddress;
  currency: Currency;
  amount?: BigNumber;
}

export function useWithdraw({ localVault, mainVault, currency, amount }: WithdrawProps) {
  const queryClient = useQueryClient();

  const { address } = useAccount();

  const openModal = useTransactionModalStore((state) => state.openModal);
  const addTransaction = useTransactionsStore((state) => state.addTransaction);

  const { data: axelarFee, isLoading: isAxelarFeeLoading } = useQueryAxelarFee(
    localVault.network,
    mainVault.network,
  );

  const { config, isLoading: isPrepareContractLoading } = usePrepareContractWrite({
    address: localVault.address,
    abi: LOCAL_VAULT_ABI,
    functionName: 'withdrawRequest',
    args: amount && address && [amount, address],
    overrides: { value: axelarFee },
    enabled: !!amount && !!axelarFee && !!address,
  });

  const {
    write: withdraw,
    isLoading: isWriteLoading,
    data: writeData,
  } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      if (!amount || !address) {
        return;
      }

      const transaction: StoredTransaction = {
        address,
        hash: data.hash,
        type: 'withdraw',
        network: currency.network,
        amount: normalizeAmountStoredTransaction(amount, currency.decimals),
        timestamp: Date.now(),
      };

      openModal(transaction);
      addTransaction(transaction);
    },
  });

  const { isLoading: isLoadingWaitForTransaction } = useWaitForTransaction({
    hash: writeData?.hash,
    confirmations: 3,
    onSuccess: () => {
      queryClient.invalidateQueries(
        graphKeys.withdrawRequestsLocalVault(localVault.network, address),
      );
    },
  });

  return {
    isPending: isWriteLoading || isLoadingWaitForTransaction,
    withdraw,
    isLoading: isAxelarFeeLoading || isPrepareContractLoading,
  };
}
