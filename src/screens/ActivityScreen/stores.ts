import { create } from 'zustand';
import { Network } from '~/lib/network';

interface TransactionFilterState {
  deposit: boolean;
  withdrawn: boolean;
  networks: Set<Network>;
}

interface TransactionFilterActions {
  setDeposit: (deposit: boolean) => void;
  setWithdrawn: (withdrawn: boolean) => void;
  checkNetwork: (network: Network, value: boolean) => void;
  reset: () => void;
}

const INITIAL_STATE: TransactionFilterState = {
  deposit: false,
  withdrawn: false,
  networks: new Set(),
};

export const useTransactionFilterStore = create<TransactionFilterState & TransactionFilterActions>(
  (set) => ({
    ...INITIAL_STATE,
    setDeposit: (deposit: boolean) => {
      set({ deposit });
    },
    setWithdrawn: (withdrawn: boolean) => {
      set({ withdrawn });
    },
    reset: () => {
      set(INITIAL_STATE);
    },
    checkNetwork: (network: Network, value: boolean) => {
      set((state) => {
        const networks = new Set(state.networks);
        if (value) {
          networks.add(network);
        } else {
          networks.delete(network);
        }
        return { networks };
      });
    },
  }),
);
