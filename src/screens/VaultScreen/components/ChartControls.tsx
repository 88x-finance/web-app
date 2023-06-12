'use client';

import { classNames } from '~/lib/classNames';
import { ToggleGroup, ToggleGroupItem } from '~/ui/ToggleGroup';
import { ChartRange, ChartType, useChartStore } from '../stores';

interface Props {
  className?: string;
}

export function ChartControls({ className }: Props): JSX.Element {
  const { range, setRange, setType, type } = useChartStore();

  return (
    <div
      className={classNames(
        'flex flex-col gap-8 @container md:flex-row md:items-center md:gap-20',
        className,
      )}
    >
      <div className="hidden @xl:block max-md:hidden">Historical rate</div>
      <ToggleGroup
        type="single"
        value={type}
        onValueChange={(value) => {
          if (!value) {
            return;
          }

          setType(value as ChartType);
        }}
      >
        <ToggleGroupItem value="apy">APY</ToggleGroupItem>
        <ToggleGroupItem value="tvl">TVL</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        className="md:ml-auto"
        value={range}
        onValueChange={(value) => {
          if (!value) {
            return;
          }

          setRange(value as ChartRange);
        }}
      >
        <ToggleGroupItem value="1w">1W</ToggleGroupItem>
        <ToggleGroupItem value="1m">1M</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
