export const MULTICALL_ROUTER_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountIn',
        type: 'uint256',
      },
      {
        internalType: 'bytes[]',
        name: '_calldata',
        type: 'bytes[]',
      },
      {
        internalType: 'address[]',
        name: '_receiveSides',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_path',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_offset',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_values',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'multicall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: '_calldata',
        type: 'bytes[]',
      },
      {
        internalType: 'address[]',
        name: '_receiveSides',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_path',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_offset',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_values',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'multicallNative',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'multicallRouterGateway',
    outputs: [
      {
        internalType: 'contract MulticallRouterGateway',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
