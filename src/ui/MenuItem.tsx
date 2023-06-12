'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { classNames } from '~/lib/classNames';

type MenuItemProps = LinkProps & {
  children: React.ReactNode;
};

export function MenuItem({ children, ...props }: MenuItemProps): JSX.Element {
  const { href } = props;

  const pathname = usePathname();

  const active = href === pathname;

  return (
    <Link
      className={classNames(
        'flex items-center justify-center transition-colors',
        active ? 'text-dark-1' : 'text-dark-4 hover:text-dark-1',
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
