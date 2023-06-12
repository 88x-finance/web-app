'use client';

import { useTransactionModalStore } from '~/stores/transactionModalStore';
import { Dialog, DialogContent } from '~/ui/Dialog';
import { TransactionDetails } from './TransactionDetails';

export function TransactionStatusModal(): JSX.Element {
  const { transaction, closeModal: close } = useTransactionModalStore();

  return (
    <Dialog
      open={!!transaction}
      onOpenChange={(open) => {
        if (open) {
          return;
        }

        close();
      }}
    >
      <DialogContent className="min-w-[480px]">
        {transaction && <TransactionDetails transaction={transaction} />}
      </DialogContent>
    </Dialog>
  );
}
