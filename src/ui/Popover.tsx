'use client';

import { Arrow, Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { InfoCircle } from 'iconsax-react';
import Balancer from 'react-wrap-balancer';
import { classNames } from '~/lib/classNames';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Popover({ className, children }: Props): JSX.Element {
  return (
    <Root>
      <Trigger
        className={classNames(
          'grid h-20 w-20 place-content-center rounded-[0.375rem] transition-colors hover:bg-dark-6',
          className,
        )}
      >
        <InfoCircle size={16} />
      </Trigger>

      <Portal>
        <Content
          className="max-w-[18rem] rounded-[0.5rem] bg-dark-1/70 px-14 py-8 text-xsm leading-[1.4] text-dark-7"
          side="right"
          sideOffset={4}
          align="start"
          alignOffset={-8}
        >
          <Balancer>{children}</Balancer>
          <Arrow width={12} height={6} className="fill-dark-1/70" />
        </Content>
      </Portal>
    </Root>
  );
}
