import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoredTransaction } from '~/lib/storedTransaction';

interface TransactionsStore {
  transactions: StoredTransaction[];
  addTransaction: (transaction: StoredTransaction) => void;
}

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export const useTransactionsStore = create(
  persist<TransactionsStore>(
    (set) => ({
      transactions: [],
      addTransaction: (transaction) => {
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
      },
    }),
    { name: NEXT_PUBLIC_ENVIRONMENT === 'mainnet' ? 'transactions' : 'transactions-testnet' },
  ),
);
