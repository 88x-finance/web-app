import { AxelarGMPRecoveryAPI, Environment } from '@axelar-network/axelarjs-sdk';
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export default async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const hash = searchParams.get('hash');
  if (!hash) {
    return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
  }

  if (typeof hash !== 'string') {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
  }

  const sdk = new AxelarGMPRecoveryAPI({
    environment: NEXT_PUBLIC_ENVIRONMENT === 'mainnet' ? Environment.MAINNET : Environment.TESTNET,
  });

  try {
    const txStatus = await sdk.queryTransactionStatus(hash);

    return NextResponse.json(txStatus);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
