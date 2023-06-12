import { Address } from 'wagmi';
import { Token } from '~/lib/currency';
import { fetchApi } from '~/lib/fetchApi';
import { chainIdToNetwork } from '~/lib/network';
import { Vault, VaultHistoricData } from '~/lib/vault';
import type { ChartRange } from './stores';

export function getVault(slug: string): Promise<Vault> {
  return fetchApi(`/vaults/${slug}`);
}

export async function getVaultHistoricData(
  slug: string,
  range: ChartRange,
): Promise<VaultHistoricData[]> {
  let period = '';
  if (range === '1m') {
    period = 'month';
  } else if (range === '1w') {
    period = 'week';
  } else {
    period = 'year';
  }

  return fetchApi(`/vaults/${slug}/history/${period}`);
}

interface TokenListToken {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

export async function getTokens(): Promise<Token[]> {
  const response = await fetch('https://tokens.uniswap.org');
  const tokenList = (await response.json()) as {
    tokens: TokenListToken[];
  };

  const tokens: Token[] = [];
  for (const token of tokenList.tokens) {
    const { chainId, address, decimals, name, symbol } = token;

    const network = chainIdToNetwork(chainId);
    if (!network) {
      continue;
    }

    tokens.push({ network, address, decimals, name, symbol });
  }

  return tokens;
}
