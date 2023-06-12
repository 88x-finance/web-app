'use client';

import { Label } from '@radix-ui/react-label';
import { utils } from 'ethers';
import { useId, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '~/hooks/useCurrencyBalance';
import { classNames } from '~/lib/classNames';
import { Currency, isToken } from '~/lib/currency';
import { formatAmount } from '~/lib/formatters';
import { NATIVE_WRAPPED_ADDRESS } from '~/lib/tokens';
import { NumericalInput } from '~/ui/NumericalInput';
import { CurrencyPicker } from './CurrencyPicker';
import { useQueryTokenPrices } from './useQueryTokenPrices';

interface Props {
  className?: string;
  title: string;
  currency: Currency;
  onCurrencyChange?: (token: Currency) => void;
  value: string;
  onValueChange?: (value: string) => void;
}

export function AmountInput({
  className,
  title,
  currency,
  onCurrencyChange,
  value,
  onValueChange,
}: Props) {
  const id = useId();

  const { address } = useAccount();
  const { data } = useCurrencyBalance({ address, currency, watch: true });

  const { data: tokenPrices } = useQueryTokenPrices(currency.network);

  const tokenAddress = isToken(currency)
    ? currency.address
    : NATIVE_WRAPPED_ADDRESS[currency.network];
  const tokenPrice = tokenAddress && tokenPrices?.[tokenAddress];

  const price = useMemo(() => {
    if (!tokenPrice) {
      return undefined;
    }

    let number = Number(value);
    if (Number.isNaN(number)) {
      number = 0;
    }

    return (number * tokenPrice).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }, [tokenPrice, value]);

  return (
    <div className={classNames('flex flex-col border border-gray-5 p-16', className)}>
      <Label htmlFor={id} className="text-sm text-dark-4">
        {title}
      </Label>
      <div className="mt-14 flex items-center gap-6">
        <NumericalInput
          id={id}
          className="w-0 flex-1 text-h4 outline-none"
          value={value}
          onValueChange={onValueChange}
        />
        <CurrencyPicker value={currency} onChange={onCurrencyChange} />
      </div>

      <div className="mt-6 flex justify-between gap-6 text-xsm text-dark-5">
        <div>{price && `≈${price}$`}</div>
        <button
          className="transition-opacity hover:opacity-80"
          onClick={() => {
            if (!data || !onValueChange) {
              return;
            }

            let value = Number(utils.formatUnits(data.value, data.decimals));
            if (Number.isNaN(value)) {
              return;
            }

            const decimals = 4;
            const calcDecimals = Math.pow(10, decimals);
            value = Math.trunc(value * calcDecimals) / calcDecimals;

            onValueChange(value.toString());
          }}
        >
          Balance:{' '}
          <span className="text-dark-1">
            {data ? formatAmount(data.value, data.decimals) : '0'}
          </span>
        </button>
      </div>
    </div>
  );
}
