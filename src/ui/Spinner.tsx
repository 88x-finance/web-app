import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { ForwardRefComponent } from '~/types/polymorphic';

export interface SpinnerProps extends VariantProps<typeof spinner> {
  className?: string;
}

const spinner = cva('spinner', {
  variants: {
    variant: {
      white: '',
      dark: 'spinner-dark',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
});

export const Spinner = forwardRef(function Spinner(
  { as, variant, className, ...props },
  ref,
): JSX.Element {
  const Component = as ?? 'div';

  return <Component ref={ref} className={spinner({ variant, className })} {...props} />;
}) as ForwardRefComponent<'div', SpinnerProps>;
