import { TooltipWithBounds } from '@visx/tooltip';
import { ChartMargin } from './types';

interface Props {
  left: number;
  top: number;
  innerHeight: number;
  margin: ChartMargin;
  format: (value: number) => string;
  value: number;
}

const HEIGHT = 28;
const EXTRA_BOTTOM_MARGIN = HEIGHT + 16;

export function ValueTooltip({
  top,
  left,
  innerHeight,
  margin,
  value,
  format,
}: Props): JSX.Element {
  return (
    <TooltipWithBounds
      key={left} // To make the tooltip reset its position when the value changes and recalculate the bounds
      top={Math.min(
        top - HEIGHT / 2 - 1, // 1px for border of dot
        innerHeight - margin.bottom - EXTRA_BOTTOM_MARGIN,
      )}
      unstyled
      left={left + margin.left}
      className="pointer-events-none absolute flex h-28 items-center rounded-50 bg-black px-10 text-sm text-white shadow"
    >
      {format(value)}
    </TooltipWithBounds>
  );
}
