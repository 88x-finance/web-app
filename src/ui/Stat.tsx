import { cva, VariantProps } from 'class-variance-authority';
import { classNames } from '~/lib/classNames';
import { Popover } from './Popover';

interface Props extends VariantProps<typeof valueClassName> {
  className?: string;
  value: string;
  title: string;
  helpText?: string;
}

const valueClassName = cva(['font-public-sans', 'font-light'], {
  variants: {
    size: {
      xl: '',
      lg: '',
      base: '',
    },
    variant: {
      primary: ['text-dark-1'],
      secondary: ['text-dark-3'],
    },
  },
  compoundVariants: [
    { size: 'xl', variant: 'primary', class: 'text-h1 mb-4' },
    { size: 'xl', variant: 'secondary', class: 'text-h3 mb-8' },
    { size: 'lg', variant: 'primary', class: 'text-h3 mb-6' },
    { size: 'lg', variant: 'secondary', class: 'text-xl mb-8' },
    { size: 'base', variant: 'primary', class: 'text-base mb-4' },
    { size: 'base', variant: 'secondary', class: 'text-sm mb-4' },
  ],
});

const titleClassName = cva('flex items-center gap-2 text-gray-4', {
  variants: {
    size: {
      xl: 'text-base',
      lg: 'text-base',
      base: 'text-xsm',
    },
  },
});

export function Stat({
  className,
  value,
  title,
  variant = 'primary',
  size = 'base',
  helpText,
}: Props): JSX.Element {
  return (
    <div className={classNames('flex flex-col', className)}>
      <div className={valueClassName({ variant, size })}>{value}</div>
      <div className={titleClassName({ size })}>
        {title}
        {!!helpText && <Popover>{helpText}</Popover>}
      </div>
    </div>
  );
}
