import { AxelarQueryAPI, Environment, EvmChain, GasToken } from '@axelar-network/axelarjs-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Network } from '~/lib/network';

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const fromNetwork = searchParams.get('fromNetwork');
  const toNetwork = searchParams.get('toNetwork');

  if (!fromNetwork || !toNetwork) {
    return NextResponse.json({ error: 'Missing fromNetwork or toNetwork' }, { status: 400 });
  }

  if (typeof fromNetwork !== 'string' || typeof toNetwork !== 'string') {
    return NextResponse.json({ error: 'Invalid fromNetwork or toNetwork' }, { status: 400 });
  }

  const sdk = new AxelarQueryAPI({
    environment: NEXT_PUBLIC_ENVIRONMENT === 'mainnet' ? Environment.MAINNET : Environment.TESTNET,
  });

  try {
    const fee = await sdk.estimateGasFee(
      getEvmChainFromNetwork(fromNetwork as Network),
      getEvmChainFromNetwork(toNetwork as Network),
      getGasTokenFromNetwork(fromNetwork as Network),
    );

    return NextResponse.json({ fee });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

class UnknownNetworkError extends Error {
  constructor(network: Network) {
    super(`Unknown network: ${network}`);
  }
}

function getEvmChainFromNetwork(network: Network): EvmChain {
  switch (network) {
    case 'ethereum':
      return EvmChain.ETHEREUM;
    case 'polygon':
    case 'polygonMumbai':
      return EvmChain.POLYGON;
    case 'avalanche':
      return EvmChain.AVALANCHE;
    case 'bnb':
    case 'bnbTestnet':
      return EvmChain.BINANCE;
    case 'moonbeam':
      return EvmChain.MOONBEAM;
    case 'arbitrum': // @@
      return 'arbitrum' as EvmChain;
    default:
      throw new UnknownNetworkError(network);
  }
}

function getGasTokenFromNetwork(network: Network): GasToken {
  switch (network) {
    case 'ethereum':
    case 'arbitrum': // @@
      return GasToken.ETH;
    case 'polygon':
    case 'polygonMumbai':
      return GasToken.MATIC;
    case 'avalanche':
      return GasToken.AVAX;
    case 'bnb':
    case 'bnbTestnet':
      return GasToken.BINANCE;
    case 'moonbeam':
      return GasToken.GLMR;

    default:
      throw new UnknownNetworkError(network);
  }
}
