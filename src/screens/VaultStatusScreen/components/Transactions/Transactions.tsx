'use client';

import { useQueries } from '@tanstack/react-query';
import { utils } from 'ethers';
import { useMemo } from 'react';
import { NetworkBadge } from '~/components/NetworkBadge';
import { getTransactionExplorerUrl } from '~/lib/network';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';
import { Vault } from '~/lib/vault';
import { styled } from '~/types/styled';
import {
  fetchLocalVaultTransactions,
  fetchMainVaultTransactions,
  VaultTransaction,
} from './fetchTransactions';

interface Props {
  vault: Vault;
}

const Td = styled('td', 'border border-gray-7 p-6');
const Th = styled(Td, 'bg-gray-7');

export function Transactions({ vault }: Props): JSX.Element {
  const {
    networks,
    contract: { network },
  } = vault;

  const queries = useQueries({
    queries: [
      {
        queryKey: ['transactions', 'main-vault'],
        queryFn: () => fetchMainVaultTransactions(network),
        staleTime: 60 * 1000, // 1 minute
      },
      ...networks.map((vaultNetwork) => ({
        queryKey: ['transactions', vaultNetwork.network],
        queryFn: () => fetchLocalVaultTransactions(vaultNetwork.network),
        staleTime: 60 * 1000, // 1 minute
      })),
    ],
  });

  const allData = queries.map((date) => date.data);

  const allTransactions = useMemo(() => {
    return allData
      .filter((data): data is VaultTransaction[] => Boolean(data))
      .flat()
      .sort((a, b) => b.blockTimestamp - a.blockTimestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, allData);

  const refreshCount = queries.filter((query) => query.isFetching).length;
  const loading = refreshCount > 0;

  return (
    <>
      <div className="mb-16 flex items-end gap-8 text-xsm">
        <div className="text-lg">Transactions</div>
        <div>Updates every minute</div>

        {loading ? (
          <div>
            Refreshing... {queries.length - refreshCount}/{queries.length}
          </div>
        ) : (
          <button
            className="text-blue-500 transition-colors hover:text-blue-800"
            onClick={() => {
              queries.forEach((date) => date.refetch());
            }}
          >
            Refresh
          </button>
        )}
      </div>
      <div className="max-h-[600px] overflow-y-scroll rounded-30 bg-white p-20 shadow">
        <table className="w-full table-auto border-collapse text-xsm">
          <thead>
            <tr>
              <Th>Network</Th>
              <Th>Time</Th>
              <Th>Type</Th>
              <Th>Tx</Th>
              <Th>Payload</Th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <Td>
                  <NetworkBadge network={transaction.network} />
                </Td>
                <Td>{new Date(transaction.blockTimestamp * 1000).toLocaleString()}</Td>
                <Td>{transaction.type}</Td>
                <Td>
                  <a
                    className="block max-w-[200px] truncate font-mono text-blue-500 transition-colors hover:text-blue-800"
                    href={getTransactionExplorerUrl(
                      transaction.network,
                      transaction.transactionHash,
                    )}
                  >
                    {transaction.transactionHash}
                  </a>
                </Td>
                <Td>
                  <pre className="max-w-[300px] overflow-y-scroll p-2">
                    {JSON.stringify(
                      transaction.payload,
                      (key, value) => {
                        if (['amount', 'lpAmount', 'delta'].includes(key)) {
                          const number = Number(utils.formatUnits(value, LP_TOKEN_DECIMALS));

                          return `${number.toFixed(2)} / ${value}`;
                        }

                        return value;
                      },
                      4,
                    )}
                  </pre>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
