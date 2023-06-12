import { Address } from 'wagmi';
import type { Token } from './currency';
import type { Network } from './network';
import { USDCx } from './tokens';

export interface VaultAddress {
  address: Address;
  network: Network;
}

export interface LocalVaultAddress extends VaultAddress {
  depositToken: Token;
}

export interface Vault {
  apy: number;
  contract: VaultAddress;
  id: string;
  name: string;
  networks: VaultNetwork[];
  tvl: number;
}

export interface VaultNetwork {
  network: Network;
  contractAddress: Address;
  strategies: VaultStrategy[];
  depositToken: Token;
}

export interface VaultHistoricData {
  timestamp: number;
  apy: number;
  tvl: number;
}

export interface VaultStrategy {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  contractAddress: Address;
  protocols: VaultStrategyProtocol[];
}

export interface VaultStrategyProtocol {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  tokens: Token[];
}

export function getVaultNetworks(vault: Vault): Network[] {
  return vault.networks
    .map((vaultNetwork) => ({
      tvl: vaultNetwork.strategies
        .map((strategy) => strategy.tvl)
        .reduce((value, tvl) => value + tvl),
      network: vaultNetwork.network,
    }))
    .sort((a, b) => b.tvl - a.tvl)
    .map((item) => item.network);
}

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

// Get the vault addresses based on the environment
export function getVaultsAddresses(vault: Vault): {
  mainVault: VaultAddress;
  localVaults: LocalVaultAddress[];
} {
  if (NEXT_PUBLIC_ENVIRONMENT === 'mainnet') {
    const localVaults = vault.networks.map(({ contractAddress, network, depositToken }) => ({
      address: contractAddress as Address,
      network,
      depositToken,
    }));

    return { mainVault: vault.contract, localVaults };
  }

  return {
    mainVault: {
      network: 'polygonMumbai',
      address: '0xD442438b5BDd30682c46Cd499a2317E3265F0918',
    },
    localVaults: [
      {
        network: 'bnbTestnet',
        address: '0xf8EA248FF1b1616E0Eb6A861ff56aD48ec3bf7C5',
        depositToken: USDCx,
      },
    ],
  };
}
