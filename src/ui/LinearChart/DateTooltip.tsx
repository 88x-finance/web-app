import { Tooltip } from '@visx/tooltip';
import { timeFormat } from 'd3-time-format';
import { ChartMargin } from './types';

interface Props {
  left: number;
  innerHeight: number;
  margin: ChartMargin;
  date: Date;
}

const formatDate = timeFormat("%b %d, '%y %H:%M");

export function DateTooltip({ left, innerHeight, margin, date }: Props): JSX.Element {
  return (
    <Tooltip
      style={{ left: left + margin.left, top: innerHeight + margin.top }}
      className="pointer-events-none absolute flex h-28 -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-50 bg-white px-10 text-center text-sm text-dark-4 shadow"
    >
      {formatDate(date)}
    </Tooltip>
  );
}
