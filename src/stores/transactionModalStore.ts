import { create } from 'zustand';
import { StoredTransaction } from '~/lib/storedTransaction';

interface TransactionModalStore {
  transaction?: StoredTransaction;
  openModal: (transaction: StoredTransaction) => void;
  closeModal: () => void;
}

export const useTransactionModalStore = create<TransactionModalStore>((set) => ({
  transaction: undefined,
  openModal: (transaction) => set({ transaction }),
  closeModal: () => set({ transaction: undefined }),
}));
