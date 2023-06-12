'use client';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { styled } from '~/types/styled';

export const ToggleGroup = styled(
  ToggleGroupPrimitive.Root,
  'flex h-36 items-center rounded-xl bg-gray-7 p-4',
);

export const ToggleGroupItem = styled(
  ToggleGroupPrimitive.Item,
  'flex h-full flex-grow items-center justify-center rounded-10 border border-transparent bg-transparent px-22 text-sm text-dark-4 transition-colors hover:text-dark-1 data-[state="on"]:border-dark-5 data-[state="on"]:bg-white data-[state="on"]:text-dark-1',
);
