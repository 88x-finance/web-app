import { classNames } from '~/lib/classNames';
import { Popover } from '~/ui/Popover';

interface Props {
  title: string;
  children: React.ReactNode;
  helpText?: React.ReactNode;
  loading?: boolean;
}

export function DetailsItem({ title, children, helpText, loading }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-4 py-12 text-sm">
      <div className="text-dark-4">{title}:</div>
      {!!helpText && <Popover className="text-dark-5">{helpText}</Popover>}
      <div className={classNames('ml-auto', loading && 'animate-pulse')}>{children}</div>
    </div>
  );
}
