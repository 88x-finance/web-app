'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { classNames } from '~/lib/classNames';

interface Props {
  slug: string;
}

export function VaultLogo({ slug }: Props): JSX.Element {
  const [clicked, setClicked] = useState(false);
  const { push } = useRouter();

  return (
    <div
      className={classNames(
        'h-26 w-26 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500',
        clicked && 'animate-ping',
      )}
      onDoubleClick={() => {
        setClicked(true);
        push(`/${slug}/status`);
      }}
    />
  );
}
