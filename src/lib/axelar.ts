/**
 * To avoid bundling whole Axelar package, enums are copied from it (package does not support tree-shaking)
 */
export enum GMPStatus {
  SRC_GATEWAY_CALLED = 'source_gateway_called',
  DEST_GATEWAY_APPROVED = 'destination_gateway_approved',
  DEST_EXECUTED = 'destination_executed',
  DEST_EXECUTE_ERROR = 'destination_execute_error',
  DEST_EXECUTING = 'executing',
  UNKNOWN_ERROR = 'unknown_error',
  CANNOT_FETCH_STATUS = 'cannot_fetch_status',
}

export enum GasPaidStatus {
  GAS_UNPAID = 'gas_unpaid',
  GAS_PAID = 'gas_paid',
  GAS_PAID_NOT_ENOUGH_GAS = 'gas_paid_not_enough_gas',
  GAS_PAID_ENOUGH_GAS = 'gas_paid_enough_gas',
}

const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export function getAxelarExplorerUrl(txHash: string): string {
  if (NEXT_PUBLIC_ENVIRONMENT === 'mainnet') {
    return `https://axelarscan.io/gmp/${txHash}`;
  }

  return `https://testnet.axelarscan.io/gmp/${txHash}`;
}
