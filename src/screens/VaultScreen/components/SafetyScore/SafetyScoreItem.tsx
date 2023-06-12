'use client';

import { Popover } from '~/ui/Popover';

interface Props {
  text: string;
  protocol: string;
  helpText?: React.ReactNode;
}

export function SafetyScoreItem({ text, protocol, helpText }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-12">
      <div className="relative grid h-48 w-48 flex-shrink-0 place-content-center rounded-2xl bg-white shadow">
        <div className="h-0 w-0 border-x-8 border-b-8 border-t-0 border-x-transparent border-b-green-1" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {text}
          {!!helpText && (
            <>
              {' '}
              <Popover className="text-dark-5">{helpText}</Popover>
            </>
          )}
        </div>
        <div className="text-sm text-dark-4">{protocol}</div>
      </div>
    </div>
  );
}
