'use client';

import { BigNumber } from 'ethers';
import { ArrowRight2 } from 'iconsax-react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '~/components/ConnectButton';
import { formatAmount } from '~/lib/formatters';
import { getNetworkName } from '~/lib/network';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';
import { useTransactionModalStore } from '~/stores/transactionModalStore';
import { useTransactionsStore } from '~/stores/transactionsStore';
import { useTransactionFilterStore } from '../stores';
import * as Table from './Table';

export function ActivityTable(): JSX.Element {
  const { address } = useAccount();

  const transactions = useTransactionsStore((state) => state.transactions);
  const openModal = useTransactionModalStore((state) => state.openModal);

  const { deposit, withdrawn, networks } = useTransactionFilterStore();

  const filteredTransactions = useMemo(() => {
    if (!address) {
      return [];
    }

    return transactions.filter((transaction) => {
      if (transaction.address !== address) {
        return false;
      }

      if (networks.size && !networks.has(transaction.network)) {
        return false;
      }

      if (deposit && !withdrawn) {
        return transaction.type === 'deposit';
      }

      if (!deposit && withdrawn) {
        return transaction.type === 'withdraw';
      }

      return true;
    });
  }, [address, transactions, networks, deposit, withdrawn]);

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-16 p-24 text-center">
        <div className="text-dark-4">Please connect your wallet to view your activity.</div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <Table.Root>
      <Table.HeadRow className="hidden sm:contents">
        <Table.HeadCell>Amount/Network</Table.HeadCell>
        <Table.HeadCell>Address/Status</Table.HeadCell>
        <Table.HeadCell>Time</Table.HeadCell>
        <Table.HeadCell />
      </Table.HeadRow>
      {filteredTransactions.map((transaction) => (
        <Table.Row
          key={transaction.hash}
          onClick={() => {
            openModal(transaction);
          }}
        >
          <Table.Cell>
            <Table.CellEntry data-label="Amount">
              ${formatAmount(BigNumber.from(transaction.amount), LP_TOKEN_DECIMALS, 4)}
            </Table.CellEntry>
            <Table.CellEntry data-label="Network" className="sm:text-dark-4">
              {getNetworkName(transaction.network)}
            </Table.CellEntry>
          </Table.Cell>
          <Table.Cell>
            <Table.CellEntry data-label="Address" className="sm:truncate">
              {transaction.address}
            </Table.CellEntry>
            <Table.CellEntry data-label="Status" className="sm:text-dark-4">
              {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawn'}
            </Table.CellEntry>
          </Table.Cell>
          <Table.Cell>
            <Table.CellEntry data-label="Time" className="border-b-0">
              {new Date(transaction.timestamp).toLocaleString()}
            </Table.CellEntry>
            <Table.CellEntry data-label="" className="hidden sm:block sm:text-green-1">
              View Transaction
            </Table.CellEntry>
          </Table.Cell>
          <Table.Cell className="max-sm:hidden">
            <ArrowRight2 size={18} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  );
}
