'use client';

import * as ScrollAreaPrimitives from '@radix-ui/react-scroll-area';
import React from 'react';
import { classNames } from '~/lib/classNames';
import { styled } from '~/types/styled';

type Props = React.ComponentProps<typeof ScrollAreaPrimitives.Root>;

export function ScrollArea({ className, children, ...props }: Props): JSX.Element {
  return (
    <ScrollAreaPrimitives.Root className={className} {...props}>
      {children}
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaPrimitives.Root>
  );
}

const ScrollAreaScrollbar = styled(ScrollAreaPrimitives.Scrollbar, (props) =>
  classNames(
    'isolate flex touch-none select-none p-2',
    props.orientation === 'horizontal' ? 'h-8 flex-col' : 'w-8',
  ),
);

const ScrollAreaThumb = styled(
  ScrollAreaPrimitives.Thumb,
  classNames(
    'z-10 flex-1 rounded-[0.125rem] bg-gray-5 relative', // Increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
    'before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[""]',
  ),
);

export const ScrollAreaViewport = styled(ScrollAreaPrimitives.Viewport, 'h-full w-full');
