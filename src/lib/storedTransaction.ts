import type { Hash } from '@wagmi/core';
import { BigNumber } from 'ethers';
import type { Address } from 'wagmi';
import type { Network } from './network';
import { LP_TOKEN_DECIMALS } from './tokens';

export interface StoredTransaction {
  address: Address;
  hash: Hash;
  network: Network;
  type: 'deposit' | 'withdraw';
  amount: string;
  timestamp: number;
}

export function normalizeAmountStoredTransaction(amount: BigNumber, decimals: number): string {
  if (decimals === LP_TOKEN_DECIMALS) {
    return amount.toString();
  }

  if (decimals > LP_TOKEN_DECIMALS) {
    return amount.div(BigNumber.from(10).pow(decimals - LP_TOKEN_DECIMALS)).toString();
  }

  return amount.mul(BigNumber.from(10).pow(LP_TOKEN_DECIMALS - decimals)).toString();
}
