import { cva, VariantProps } from 'class-variance-authority';

export interface SeparatorProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof separator> {
  decorative?: boolean;
}

const separator = cva('bg-gray-5', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

// Based on https://github.com/radix-ui/primitives/blob/02b036d4181131dfc0224044ba5f17d260bce2f8/packages/react/separator/src/Separator.tsx
export function Separator({
  className,
  orientation,
  decorative,
  ...props
}: SeparatorProps): JSX.Element {
  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
  const semanticProps = decorative
    ? { role: 'none' }
    : { 'aria-orientation': ariaOrientation, role: 'separator' };

  return (
    <div
      className={separator({ orientation, className })}
      data-orientation={orientation}
      {...semanticProps}
      {...props}
    />
  );
}
