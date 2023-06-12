'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Add, Minus } from 'iconsax-react';
import React from 'react';
import { classNames } from '~/lib/classNames';
import { styled } from '~/types/styled';

interface AccordionItemProps {
  className?: string;
  value: string;
  title: string;
  children: React.ReactNode;
}

export const Accordion = styled(AccordionPrimitive.Root, 'flex flex-col gap-12');

export function AccordionItem({
  value,
  title,
  className,
  children,
}: AccordionItemProps): JSX.Element {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={classNames('rounded-20 bg-white shadow', className)}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex h-60 w-full items-center justify-between px-24 text-sm">
          <div className="text-left">{title}</div>
          <Add className="text-dark-4 group-data-[state=open]:hidden" size={20} />
          <Minus className="text-dark-4 group-data-[state=closed]:hidden" size={20} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content className="overflow-hidden  text-sm leading-[140%] text-dark-4 data-[state='open']:animate-accordion-down data-[state='closed']:animate-accordion-up">
        <div className="px-24 pb-20">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
