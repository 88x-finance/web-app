import { BigNumber } from 'ethers';
import { Currency } from '~/lib/currency';
import { formatAmount } from '~/lib/formatters';
import { CurrencyIcon } from '~/ui/CurrencyIcon/CurrencyIcon';

export interface Props {
  className?: string;
  currency: Currency;
  balance?: BigNumber;
  onClick?: () => void;
}

export function CurrencyListItem({ currency, balance, onClick }: Props): JSX.Element {
  const { symbol, name, decimals } = currency;

  return (
    <button
      type="button"
      className="flex h-48 w-full gap-10 rounded-10 bg-white p-8 text-left transition-colors hover:bg-gray-6"
      onClick={onClick}
    >
      <CurrencyIcon className="h-32 w-32 rounded-full" currency={currency} size={32} />
      <div className="flex flex-col gap-2">
        <div className="text-sm">{name}</div>
        <div className="text-xsm text-dark-4">{symbol}</div>
      </div>
      <div className="ml-auto text-sm slashed-zero tabular-nums">
        {balance ? formatAmount(balance, decimals, 4) : '0'}
      </div>
    </button>
  );
}
