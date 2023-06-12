import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { ForwardRefComponent } from '~/types/polymorphic';

export interface ButtonProps extends VariantProps<typeof button> {
  className?: string;
}

const button = cva(
  'flex text-base border rounded-xl font-medium h-36 px-16 transition-colors items-center justify-center',
  {
    variants: {
      variant: {
        white:
          'bg-white border-dark-5 disabled:border-dark-6 disabled:text-dark-4 hover:border-dark-4 shadow text-dark-1',
        dark: 'bg-dark-1 text-white border-transparent hover:bg-dark-2 disabled:bg-dark-4',
      },
    },
    defaultVariants: {
      variant: 'white',
    },
  },
);

export const Button = forwardRef(function Button(
  { as, variant, className, ...props },
  ref,
): JSX.Element {
  const Component = as ?? 'button';

  return <Component ref={ref} className={button({ variant, className })} {...props} />;
}) as ForwardRefComponent<'button', ButtonProps>;
