import type { Address } from 'wagmi';
import { Token } from './currency';
import type { Network } from './network';

export const apiKeys = {
  axelarStatus: (hash: string) => ['api', 'axelar-status', hash] as const,
  axelarFee: (from: Network, to: Network) => ['api', 'axelar-fee', from, to] as const,
  chartHistory: (slug: string, range: string) => ['api', 'chart-history', slug, range] as const,
  tokenPrices: (chainId?: number) => ['api', 'token-prices', chainId] as const,
  balanceHistory: (address?: Address, network?: Network) =>
    ['covalent', 'balance-history', address, network] as const,
};

export const ethersKeys = {
  allowance: (address?: Address, tokenAddress?: Address, spenderAddress?: Address) =>
    ['ethers', 'allowance', address, tokenAddress, spenderAddress] as const,
  balances: (address?: Address, blockNumber?: number, tokens?: Token[]) =>
    ['ethers', 'balances', address, blockNumber, tokens] as const,
  tokens: () => ['ethers', 'tokens'] as const,
};

export const graphKeys = {
  totalProfit: (address?: Address) => ['graph', 'totalProfit', address] as const,
  withdrawRequestsLocalVault: (network?: Network, address?: Address) =>
    ['graph', 'withdrawRequests', 'localVault', network, address] as const,
  satisfyWithdrawsMainVault: (network?: Network, address?: Address) =>
    ['graph', 'satisfyWithdraws', 'mainVault', network, address] as const,
};

export const openOceanKeys = {
  swapQuote: (
    network?: Network,
    fromTokenAddress?: Address,
    toTokenAddress?: Address,
    amount?: string,
  ) => ['openOcean', 'swapQuote', network, fromTokenAddress, toTokenAddress, amount] as const,
};
