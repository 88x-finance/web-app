import { GMPStatusResponse } from '@axelar-network/axelarjs-sdk';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { GasPaidStatus, GMPStatus } from '~/lib/axelar';

export function getTransactionStatusMessage(
  transactionReceipt?: TransactionReceipt,
  axelarStatusResponse?: GMPStatusResponse,
) {
  if (!transactionReceipt) {
    return 'Mining';
  }

  if (transactionReceipt.status === 0) {
    return 'Mining failed';
  }

  if (!axelarStatusResponse) {
    return 'Waiting for Axelar';
  }

  const { status, gasPaidInfo } = axelarStatusResponse;

  if (status === GMPStatus.SRC_GATEWAY_CALLED) {
    const gasPaidStatus = gasPaidInfo?.status;
    if (gasPaidStatus === GasPaidStatus.GAS_UNPAID) {
      return 'Need to pay gas in Axelar';
    }

    if (gasPaidStatus === GasPaidStatus.GAS_PAID_NOT_ENOUGH_GAS) {
      return 'Need to pay more gas in Axelar';
    }

    return 'Waiting for the call in Axelar';
  }

  if (status === GMPStatus.DEST_GATEWAY_APPROVED) {
    return 'Waiting for the execute in Axelar';
  }

  if (status === GMPStatus.DEST_EXECUTE_ERROR || status === GMPStatus.UNKNOWN_ERROR) {
    return 'Axelar execute failed';
  }

  return 'Success';
}
