'use client';

import * as CheckboxPrimitives from '@radix-ui/react-checkbox';
import { useId } from 'react';
import { classNames } from '~/lib/classNames';
import Check from './check.svg';

type Props = Omit<CheckboxPrimitives.CheckboxProps, 'id'>;

export function Checkbox({ children, className, ...props }: Props): JSX.Element {
  const id = useId();

  return (
    <div className={classNames('flex items-center gap-8', className)}>
      <CheckboxPrimitives.Root
        id={id}
        className="pt-1 flex h-20 w-20 items-center justify-center rounded-[0.4375rem] border border-dark-5 data-[state=checked]:border-blue-1 data-[state=checked]:bg-blue-1"
        {...props}
      >
        <CheckboxPrimitives.Indicator>
          <Check />
        </CheckboxPrimitives.Indicator>
      </CheckboxPrimitives.Root>
      <label className="cursor-pointer truncate text-sm text-dark-3" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
