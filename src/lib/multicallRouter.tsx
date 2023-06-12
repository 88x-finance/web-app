import { Address } from 'wagmi';
import { NETWORK, Network } from './network';

export interface MulticallRouter {
  router: Address;
  gateway: Address;
}

export const MULTICALL_ROUTER: Partial<Record<Network, MulticallRouter>> = {
  [NETWORK.bnb]: {
    router: '0x7461E26e14aF994E85a6D651dfbbf6B575a689e1',
    gateway: '0x00c2A80291ef281027dfe22A9B49B7e1c23f742B',
  },
  [NETWORK.polygon]: {
    router: '0xAED2Ba58c78463Df93Ca35E53f26Aada5c8972b9',
    gateway: '0x27306154A3E90772013920E474D2fd8aa0Ec5e90',
  },
  [NETWORK.avalanche]: {
    router: '0x2aFAD49DCA9d06CDee1920bEdD618d1dFc11a669',
    gateway: '0xfcCC2531381160A6b352bFBe5D8e4129Be233EC1',
  },
  [NETWORK.arbitrum]: {
    router: '0x176ba24d2A7e08c7368c896476815EAF54a46752',
    gateway: '0xb3BDD6ac94dd44c6eE6152d17f918Ab0E0AcB267',
  },
};
