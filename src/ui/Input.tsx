import { ComponentProps } from 'react';
import { classNames } from '~/lib/classNames';

export function Input({ className, ...props }: ComponentProps<'input'>): JSX.Element {
  return (
    <input
      className={classNames(
        'flex h-36 items-center rounded-[0.75rem] bg-gray-6 px-16 text-sm placeholder:text-dark-4',
        className,
      )}
      {...props}
    />
  );
}
