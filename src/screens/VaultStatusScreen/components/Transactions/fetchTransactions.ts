import { Network } from '~/lib/network';
import { fetchLocalVaultGraph, fetchMainVaultGraph } from '~/lib/theGraph';

export interface VaultTransaction {
  id: string;
  type: string;
  transactionHash: string;
  blockTimestamp: number;
  payload: Record<string, unknown>;
  network: Network;
}

async function parseTransactions(data: any, network: Network): Promise<VaultTransaction[]> {
  const transactions: VaultTransaction[] = [];
  Object.values(data).forEach((txs: any) => {
    txs.forEach(({ id, transactionHash, blockTimestamp, __typename, ...payload }: any) => {
      transactions.push({
        id,
        transactionHash,
        blockTimestamp: Number(blockTimestamp),
        type: __typename,
        payload,
        network,
      } satisfies VaultTransaction);
    });
  });

  return transactions;
}

export async function fetchLocalVaultTransactions(network: Network): Promise<VaultTransaction[]> {
  const data = await fetchLocalVaultGraph(
    network,
    `
  {
    deposits(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sender
      bnbUser
      amount
      blockTimestamp
      transactionHash
      __typename
    }
    depositIntoStrategies(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      strategyName
      amount
      blockTimestamp
      transactionHash
      __typename
    }
    migrateRewards(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      strategyName
      blockTimestamp
      transactionHash
      __typename
    }
    updateInfos(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      delta
      isPositive
      blockTimestamp
      transactionHash
      __typename
    }
    withdrawFromStrategies(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      strategyName
      blockTimestamp
      transactionHash
      __typename
    }
    updateInfos(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      delta
      isPositive
      blockTimestamp
      transactionHash
      __typename
    }
    withdrawRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      lpAmount
      blockTimestamp
      transactionHash
      __typename
    }
    satisfyWithdrawRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      users
      amounts
      blockTimestamp
      transactionHash
      __typename
    }
    transferReceiveds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sourceChain
      amount
      blockTimestamp
      transactionHash
      __typename
    }
  }
  `,
  );

  return parseTransactions(data, network);
}

export async function fetchMainVaultTransactions(network: Network): Promise<VaultTransaction[]> {
  const data = await fetchMainVaultGraph(
    network,
    `
  {
    deposits(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sourceChain
      amount
      lpAmount
      user
      blockTimestamp
      transactionHash
      __typename
    }
    depositIntoStrategies(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sourceChain
      amount
      blockTimestamp
      transactionHash
      __typename
    }
    returnLPs(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      lpAmount
      blockTimestamp
      transactionHash
      __typename
    }
    satisfyRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      sourceChain
      amount
      blockTimestamp
      transactionHash
      __typename
    }
    satisfyWithdraws(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      amount
      lpAmount
      blockTimestamp
      transactionHash
      __typename
    }
    satisfyWithdrawRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      chain
      blockTimestamp
      transactionHash
      __typename
    }
    updateInfos(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sourceChain
      delta
      blockTimestamp
      transactionHash
      __typename
    }
    withdrawRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sourceChain
      amount
      lpAmount
      user
      blockTimestamp
      transactionHash
      __typename
    }
    writeDownRequests(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      sourceChain
      amount
      blockTimestamp
      transactionHash
      __typename
    }
  }`,
  );

  return parseTransactions(data, network);
}
