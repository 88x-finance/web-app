import { ArrowDown2 } from 'iconsax-react';
import { useState } from 'react';
import { Currency } from '~/lib/currency';
import { CurrencyIcon } from '~/ui/CurrencyIcon/CurrencyIcon';
import { Dialog, DialogContent, DialogTrigger } from '~/ui/Dialog';
import { CurrencyList } from './CurrencyList';

interface Props {
  value: Currency;
  onChange?: (currency: Currency) => void;
}

export function CurrencyPicker({ value, onChange }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  const { symbol } = value;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center rounded text-sm" type="button" disabled={!onChange}>
          <CurrencyIcon className="mr-6 h-18 w-18 rounded-full" currency={value} size={18} />
          {symbol}
          {!!onChange && <ArrowDown2 className="ml-4" size="10" />}
        </button>
      </DialogTrigger>

      <DialogContent
        className="flex max-h-[80vh] min-h-[80vh] w-full max-w-xl flex-col overflow-hidden"
        title="Ethereum token"
      >
        {onChange && <CurrencyList onChange={onChange} setOpen={setOpen} />}
      </DialogContent>
    </Dialog>
  );
}
