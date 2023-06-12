import { Address } from 'wagmi';
import type { NativeToken, Token } from './currency';
import { Network, NETWORK } from './network';

export const LP_TOKEN_DECIMALS = 18;

export function createLPToken(network: Network, address: Address): Token {
  return {
    address,
    decimals: LP_TOKEN_DECIMALS,
    symbol: '88X LP',
    name: '88X LP Token',
    network,
  };
}

export const NATIVES: Record<Network, NativeToken> = {
  [NETWORK.ethereum]: {
    network: NETWORK.ethereum,
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
  },
  [NETWORK.polygon]: {
    network: NETWORK.polygon,
    decimals: 18,
    symbol: 'MATIC',
    name: 'Polygon',
  },
  [NETWORK.bnb]: {
    network: NETWORK.bnb,
    decimals: 18,
    symbol: 'BNB',
    name: 'BNB',
  },
  [NETWORK.avalanche]: {
    network: NETWORK.avalanche,
    decimals: 18,
    symbol: 'AVAX',
    name: 'Avalanche',
  },
  [NETWORK.moonbeam]: {
    network: NETWORK.moonbeam,
    decimals: 18,
    symbol: 'GLMR',
    name: 'Moonbeam',
  },
  [NETWORK.arbitrum]: {
    network: NETWORK.arbitrum,
    decimals: 18,
    symbol: 'ETH',
    name: 'Arbitrum',
  },

  // Testnets
  [NETWORK.bnbTestnet]: {
    network: NETWORK.bnbTestnet,
    decimals: 18,
    symbol: 'BNB',
    name: 'BNB',
  },
  [NETWORK.polygonMumbai]: {
    network: NETWORK.polygonMumbai,
    decimals: 18,
    symbol: 'MATIC',
    name: 'Polygon',
  },
};

export const NATIVE_WRAPPED_ADDRESS: Record<Network, Address> = {
  avalanche: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  bnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  bnbTestnet: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
  ethereum: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  polygon: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  polygonMumbai: '0x0000000000000000000000000000000000001010',
  moonbeam: '0xacc15dc74880c9944775448304b263d191c6077f',
  arbitrum: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
};

// Test stable token on BNB testnet
export const USDCx: Token = {
  network: NETWORK.bnbTestnet,
  address: '0x173aF3225B3765bF1e71a083769dbcdD96176CA3',
  decimals: 18,
  symbol: 'USDCx',
  name: 'USD Coin X',
};

export const STABLES: Token[] = [
  // USDC
  {
    network: NETWORK.avalanche,
    address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  {
    network: NETWORK.ethereum,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  {
    network: NETWORK.polygon,
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  {
    network: NETWORK.bnb,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    symbol: 'USDC',
    name: 'USD Coin',
  },

  USDCx,

  // DAI
  {
    network: NETWORK.ethereum,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  {
    network: NETWORK.polygon,
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  {
    network: NETWORK.bnb,
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  {
    network: NETWORK.avalanche,
    address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },

  // USDT
  {
    network: NETWORK.ethereum,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  {
    network: NETWORK.polygon,
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  {
    network: NETWORK.bnb,
    address: '0x55d398326f99059ff775485246999027b3197955',
    decimals: 18,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  {
    network: NETWORK.avalanche,
    address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },

  // BUSD
  {
    network: NETWORK.ethereum,
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    decimals: 6,
    symbol: 'BUSD',
    name: 'Binance USD',
  },
  {
    network: NETWORK.bnb,
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    decimals: 18,
    symbol: 'BUSD',
    name: 'Binance USD',
  },
  {
    network: NETWORK.avalanche,
    address: '0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98',
    decimals: 6,
    symbol: 'BUSD',
    name: 'Binance USD',
  },
];
