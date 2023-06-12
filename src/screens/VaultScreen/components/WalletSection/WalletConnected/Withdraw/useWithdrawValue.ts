import { BigNumber, utils } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { Currency } from '~/lib/currency';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';

interface Params {
  inCurrency: Currency;
  outCurrency: Currency;
  rate?: BigNumber;
}

export function useWithdrawValue({ inCurrency, outCurrency, rate }: Params) {
  const [{ value, input }, setState] = useState<{
    value: string;
    input: 'in' | 'out';
  }>({
    value: '',
    input: 'in',
  });

  const onInValueChange = useCallback((value: string) => {
    setState({
      value,
      input: 'in',
    });
  }, []);

  const onOutValueChange = useCallback((value: string) => {
    setState({
      value,
      input: 'out',
    });
  }, []);

  const bnValue = useMemo(() => {
    if (!value) {
      return;
    }

    return utils.parseUnits(value, inCurrency.decimals);
  }, [inCurrency.decimals, value]);

  const inValue = useMemo(() => {
    if (input === 'in') {
      return value;
    }

    if (!rate || !bnValue) {
      return '';
    }

    const amount = bnValue.mul(BigNumber.from(10).pow(inCurrency.decimals)).div(rate);

    return formatValue({
      amount,
      decimals: inCurrency.decimals,
      referenceValue: value,
    });
  }, [bnValue, inCurrency.decimals, input, rate, value]);

  const outValue = useMemo(() => {
    if (input === 'out') {
      return value;
    }

    if (!rate || !bnValue) {
      return '';
    }

    const amount = bnValue
      .mul(rate)
      .div(BigNumber.from(10).pow(inCurrency.decimals + LP_TOKEN_DECIMALS - outCurrency.decimals));

    return formatValue({
      amount,
      decimals: outCurrency.decimals,
      referenceValue: value,
    });
  }, [input, rate, bnValue, inCurrency.decimals, outCurrency.decimals, value]);

  return {
    inValue,
    outValue,
    onInValueChange,
    onOutValueChange,
  };
}

interface FormatParams {
  amount: BigNumber;
  decimals: number;
  referenceValue: string;
}

function formatValue({ amount, decimals, referenceValue }: FormatParams) {
  const [significant, fraction] = utils.formatUnits(amount, decimals).split('.');

  if (!fraction) {
    return significant;
  }

  const decimalsInRef = referenceValue.split('.')[1]?.length ?? 0;
  const decimalsToUse = Math.max(decimalsInRef, 2);

  const formattedFraction = fraction.slice(0, decimalsToUse);

  if (!formattedFraction || formattedFraction.match(/^[0]+$/)) {
    return significant;
  }

  return [significant, formattedFraction].join('.');
}
