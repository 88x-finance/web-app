import { Address } from 'wagmi';
import type { Network } from './network';

export type Currency = NativeToken | Token;

export interface NativeToken {
  network: Network;
  decimals: number;
  symbol: string;
  name: string;
}

export interface Token extends NativeToken {
  address: Address;
}

export function isToken(currency: Currency): currency is Token {
  return 'address' in currency;
}

export function isNativeToken(currency: Currency): currency is NativeToken {
  return !isToken(currency);
}

export function isCurrencyEqual(a: Currency, b: Currency): boolean {
  return getCurrencyKey(a) === getCurrencyKey(b);
}

export function getCurrencyKey(currency: Currency): string {
  if (isToken(currency)) {
    return `${currency.network}:${currency.address.toLowerCase()}`;
  }

  return currency.network;
}
