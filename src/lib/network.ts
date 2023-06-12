import type { Chain } from '@rainbow-me/rainbowkit';
import { Address } from 'wagmi';
import { arbitrum, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import arbitrumIcon from '~/assets/networkIcons/arbitrum.svg?url';
import avalancheIcon from '~/assets/networkIcons/avalanche.svg?url';
import bnbIcon from '~/assets/networkIcons/bnb.svg?url';
import mainnetIcon from '~/assets/networkIcons/ethereum.svg?url';
import moonbeamIcon from '~/assets/networkIcons/moonbeam.svg?url';
import polygonIcon from '~/assets/networkIcons/polygon.svg?url';

export const NETWORK = {
  ethereum: 'ethereum',
  bnb: 'bnb',
  polygon: 'polygon',
  avalanche: 'avalanche',
  moonbeam: 'moonbeam',
  arbitrum: 'arbitrum',
  polygonMumbai: 'polygonMumbai',
  bnbTestnet: 'bnbTestnet',
} as const;

export type Network = (typeof NETWORK)[keyof typeof NETWORK];

export const CHAIN_ID = {
  [NETWORK.ethereum]: 1,
  [NETWORK.bnb]: 56,
  [NETWORK.polygon]: 137,
  [NETWORK.avalanche]: 43114,
  [NETWORK.polygonMumbai]: 80001,
  [NETWORK.bnbTestnet]: 97,
  [NETWORK.moonbeam]: 1284,
  [NETWORK.arbitrum]: 42161,
} as const;

export type ChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

export function networkToChainId(network: Network): number | undefined {
  return CHAIN_ID[network];
}

const networkName: Record<Network, string> = {
  [NETWORK.ethereum]: 'Ethereum',
  [NETWORK.bnb]: 'BNB',
  [NETWORK.avalanche]: 'Avalanche',
  [NETWORK.polygon]: 'Polygon',
  [NETWORK.moonbeam]: 'Moonbeam',
  [NETWORK.polygonMumbai]: 'Polygon Mumbai',
  [NETWORK.bnbTestnet]: 'BNB Testnet',
  [NETWORK.arbitrum]: 'Arbitrum',
};

export function getNetworkName(network: Network): string {
  return networkName[network];
}

const NETWORK_EXPLORERS: Record<Network, string> = {
  [NETWORK.ethereum]: 'https://etherscan.io',
  [NETWORK.bnb]: 'https://bscscan.com',
  [NETWORK.polygon]: 'https://polygonscan.com',
  [NETWORK.avalanche]: 'https://cchain.explorer.avax.network',
  [NETWORK.moonbeam]: 'https://moonscan.io',
  [NETWORK.polygonMumbai]: 'https://mumbai.polygonscan.com',
  [NETWORK.bnbTestnet]: 'https://testnet.bscscan.com',
  [NETWORK.arbitrum]: 'https://arbiscan.io',
};

export function getAddressExplorerUrl(network: Network, address: Address): string {
  return `${NETWORK_EXPLORERS[network]}/address/${address}`;
}

export function getTransactionExplorerUrl(network: Network, hash: string): string {
  return `${NETWORK_EXPLORERS[network]}/tx/${hash}`;
}

export function chainIdToNetwork(chainId: number): Network | undefined {
  return Object.entries(CHAIN_ID).find(([, value]) => value === chainId)?.[0] as
    | Network
    | undefined;
}

export const ethereumChain: Chain = {
  ...mainnet,
  name: getNetworkName(NETWORK.ethereum),
  iconUrl: mainnetIcon,
};

export const polygonChain: Chain = {
  ...polygon,
  name: getNetworkName(NETWORK.polygon),
  iconUrl: polygonIcon,
};

export const avalancheChain: Chain = {
  id: 43_114,
  name: getNetworkName(NETWORK.avalanche),
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/avalanche'] },
    default: { http: ['https://rpc.ankr.com/avalanche'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' },
  },
  testnet: false,
  iconUrl: avalancheIcon,
};

export const bnbChain: Chain = {
  id: 56,
  name: getNetworkName(NETWORK.bnb),
  network: 'bnb',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/bsc'] },
    default: { http: ['https://rpc.ankr.com/bsc'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' },
  },
  testnet: false,
  iconUrl: bnbIcon,
};

export const bnbTestnetChain: Chain = {
  id: 97,
  name: getNetworkName(NETWORK.bnbTestnet),
  network: 'bnb-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB Testnet',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/bsc_testnet_chapel'] },
    default: { http: ['https://rpc.ankr.com/bsc_testnet_chapel'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' },
  },
  testnet: true,
  iconUrl: bnbIcon,
};

export const moonbeamChain: Chain = {
  id: 1284,
  name: getNetworkName(NETWORK.moonbeam),
  network: 'moonbeam',
  nativeCurrency: {
    decimals: 18,
    name: 'Moonbeam',
    symbol: 'GLMR',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/moonbeam'] },
    default: { http: ['https://rpc.ankr.com/moonbeam'] },
  },
  blockExplorers: {
    default: { name: 'MoonScan', url: 'https://moonscan.io' },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' },
  },
  testnet: false,
  iconUrl: moonbeamIcon,
};

export const polygonMumbaiChain: Chain = {
  ...polygonMumbai,
  name: getNetworkName(NETWORK.polygonMumbai),
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/polygon_mumbai'] },
    default: { http: ['https://rpc.ankr.com/polygon_mumbai'] },
  },
};

const arbitrumChain: Chain = {
  ...arbitrum,
  name: getNetworkName(NETWORK.arbitrum),
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/arbitrum'] },
    default: { http: ['https://rpc.ankr.com/arbitrum'] },
  },
  iconUrl: arbitrumIcon,
};

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export const ACTIVE_CHAINS =
  NEXT_PUBLIC_ENVIRONMENT === 'mainnet'
    ? [ethereumChain, polygonChain, avalancheChain, bnbChain, moonbeamChain, arbitrumChain]
    : [bnbTestnetChain, polygonMumbaiChain];
