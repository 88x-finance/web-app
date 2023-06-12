import { BigNumber, utils } from 'ethers';

export function calcDailyApy(apy: number): number {
  return Math.pow(10, Math.log10(apy + 1) / 365) - 1;
}

export function formatTvl(tvl: number): string {
  const order = Math.floor(Math.log10(tvl) / 3);

  if (order < 0) {
    return '$0.00';
  }

  const units = ['', 'k', 'M', 'B', 'T'];
  const num = tvl / 1000 ** order;

  if (num < 999) {
    return `$${num.toFixed(2)}${units[order]}`;
  }

  return tvl.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatUSD(amount: BigNumber, decimals: number, fixedDecimals = 2): string {
  const numberString = utils.formatUnits(amount, decimals);

  let number = Number(numberString);
  if (Number.isNaN(number)) {
    number = 0;
  }

  if (Number(number.toFixed(fixedDecimals)) === 0) {
    number = 0;
  }

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fixedDecimals,
    minimumFractionDigits: fixedDecimals,
  });
}

export function formatAmount(amount: BigNumber, decimals: number, fixedDecimals = 6): string {
  const numberString = utils.formatUnits(amount, decimals);

  const number = Number(numberString);
  if (Number.isNaN(number)) {
    return '0';
  }

  return number.toLocaleString('en-US', {
    maximumFractionDigits: fixedDecimals,
  });
}
