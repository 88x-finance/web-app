'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { styled } from '~/types/styled';

export const Tabs = TabsPrimitive.Root;

export const TabsList = styled(
  TabsPrimitive.List,
  'flex h-36 items-center rounded-xl bg-gray-7 p-4',
);

export const TabsTrigger = styled(
  TabsPrimitive.Trigger,
  'flex h-full flex-grow items-center justify-center rounded-10 border border-transparent bg-transparent px-22 text-sm text-dark-4 transition-colors hover:text-dark-1 data-[state="active"]:border-dark-5 data-[state="active"]:bg-white data-[state="active"]:text-dark-1',
);

export const TabsContent = TabsPrimitive.Content;
