import { classNames } from '~/lib/classNames';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Details({ className, children }: Props): JSX.Element {
  return (
    <div className={classNames('flex flex-col divide-y divide-dark-7', className)}>{children}</div>
  );
}
