import React from 'react';
import { classNames } from '~/lib/classNames';
import { TokenBadge, TokenBadgeProps } from './TokenBadge';

type TokenButtonProps = React.ComponentPropsWithoutRef<'button'> & TokenBadgeProps;

export function TokenButton({ className, ...props }: TokenButtonProps): JSX.Element {
  return (
    <TokenBadge
      as="button"
      className={classNames(
        'border border-dark-6 transition-colors hover:border-dark-4',
        className,
      )}
      {...props}
    />
  );
}
