import { forwardRef } from 'react';
import { classNames } from '~/lib/classNames';
import { Currency } from '~/lib/currency';
import { ForwardRefComponent } from '~/types/polymorphic';
import { CurrencyIcon } from '~/ui/CurrencyIcon/CurrencyIcon';

export interface TokenBadgeProps {
  className?: string;
  token: Currency;
}

export const TokenBadge = forwardRef(function TokenBadge(
  { as, className, token, ...props },
  ref,
): JSX.Element {
  const Component = as ?? 'div';
  const { symbol } = token;

  return (
    <Component
      ref={ref}
      className={classNames(
        'flex h-24 items-center gap-4 rounded-50 bg-white px-8 text-xsm shadow',
        className,
      )}
      {...props}
    >
      <CurrencyIcon className="h-14 w-14 rounded-full" currency={token} size={14} />
      {symbol}
    </Component>
  );
}) as ForwardRefComponent<'div', TokenBadgeProps>;
