'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Add } from 'iconsax-react';
import React from 'react';
import { classNames } from '~/lib/classNames';
import { styled } from '~/types/styled';

export const DialogContent = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  function DialogContent({ children, className, ...props }, forwardedRef) {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 animate-fade-in bg-dark-1/40 data-[state='open']:animate-fade-in data-[state='closed']:animate-fade-out" />
        <DialogPrimitive.Content
          ref={forwardedRef}
          className={classNames(
            'fixed top-1/2 left-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-30 bg-white p-40 shadow focus:outline-none data-[state="open"]:animate-fade-in data-[state="closed"]:animate-fade-out',
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-20 right-20 rounded-full transition-colors hover:bg-dark-6"
          >
            <Add className="rotate-45" size={24} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);

export const DialogTitle = styled(DialogPrimitive.Title, 'text-xl');

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
