'use client';

import { AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { WithParentSizeProvidedProps } from '@visx/responsive/lib/enhancers/withParentSize';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, AreaClosed, Bar, Line } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { bisector, extent, max } from 'd3-array';
import { useCallback, useMemo } from 'react';
import { classNames } from '~/lib/classNames';
import { DateTooltip } from './DateTooltip';
import { ChartMargin } from './types';
import { ValueTooltip } from './ValueTooltip';

interface Data {
  timestamp: number;
}

interface Props<T extends Data> {
  className?: string;
  data: T[];
  getY: (value: T) => number;
  formatY: (value: number) => string;
  margin?: Partial<ChartMargin>;
}

interface WithParentSizeProps<T extends Data> extends WithParentSizeProvidedProps, Props<T> {}

const ACCENT_COLOR = 'rgb(38, 161, 123)';
const AXIS_COLOR = '#f0f2f5';
const NUM_TICKS = 4;
const EXTRA_SPACE_MULTIPLIER = 1.1;

const getX = <T extends Data>(d: T) => new Date(d.timestamp);
const bisectDate = bisector<Data, Date>((d) => new Date(d.timestamp)).left;

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 0, bottom: 8, left: 70 };

function StaticLinearChart<T extends Data>({
  className,
  data,
  formatY,
  getY,
  parentHeight = 0,
  parentWidth = 0,
  ...props
}: WithParentSizeProps<T>): JSX.Element | null {
  const margin: ChartMargin = { ...DEFAULT_MARGIN, ...props?.margin };

  const { hideTooltip, showTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip<T>();

  const innerWidth = parentWidth - margin.left - margin.right;
  const innerHeight = parentHeight - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: extent(data, getX) as [Date, Date],
      }),
    [innerWidth, data],
  );

  const valueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [0, (max(data, getY) ?? 0) * EXTRA_SPACE_MULTIPLIER],
        nice: true,
        zero: true,
      }),
    [data, getY, innerHeight],
  );

  // tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      let { x } = localPoint(event) || { x: 0 };
      x = x - margin.left;
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];

      let pointData = d0;
      if (d1 && getX(d1)) {
        pointData = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }

      showTooltip({
        tooltipData: pointData,
        tooltipLeft: x,
        tooltipTop: valueScale(getY(pointData)),
      });
    },
    [margin.left, dateScale, data, showTooltip, valueScale, getY],
  );

  if (!parentHeight || !parentWidth) {
    return null;
  }

  return (
    <div className={classNames('relative', className)}>
      <svg width={parentWidth} height={parentHeight}>
        <Group left={margin.left} top={margin.top}>
          <LinearGradient
            id="area-gradient"
            from={ACCENT_COLOR}
            to={ACCENT_COLOR}
            fromOpacity={0.3}
            toOpacity={0}
          />

          <AxisLeft
            scale={valueScale}
            numTicks={NUM_TICKS}
            stroke={AXIS_COLOR}
            tickStroke={AXIS_COLOR}
            tickFormat={(value) => {
              return formatY(Number(value));
            }}
            tickLabelProps={() => ({
              className: 'text-xsm fill-dark-5 font-sans',
              textAnchor: 'end' as const,
              dy: '0.25em',
            })}
            hideTicks
          />

          <GridRows
            numTicks={NUM_TICKS}
            scale={valueScale}
            width={innerWidth}
            stroke={AXIS_COLOR}
            pointerEvents="none"
          />

          <AreaClosed
            data={data}
            x={(d) => dateScale(getX(d)) ?? 0}
            y={(d) => valueScale(getY(d)) ?? 0}
            yScale={valueScale}
            strokeWidth={1}
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />

          <Area
            data={data}
            x={(d) => dateScale(getX(d)) ?? 0}
            y={(d) => valueScale(getY(d)) ?? 0}
            strokeWidth={1}
            stroke="#26a17b"
            curve={curveMonotoneX}
          />

          <Bar
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />

          {tooltipData && tooltipTop !== undefined && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: innerHeight }}
                stroke={ACCENT_COLOR}
                strokeWidth={1}
                pointerEvents="none"
                strokeDasharray="5,3"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={ACCENT_COLOR}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>

      {tooltipData && tooltipTop !== undefined && tooltipLeft !== undefined && (
        <>
          <ValueTooltip
            innerHeight={innerHeight}
            left={tooltipLeft}
            top={tooltipTop}
            margin={margin}
            value={getY(tooltipData)}
            format={formatY}
          />

          <DateTooltip
            date={getX(tooltipData)}
            innerHeight={innerHeight}
            left={tooltipLeft}
            margin={margin}
          />
        </>
      )}
    </div>
  );
}

// Responsive wrapper component
export function LinearChart<T extends Data>(props: Props<T>) {
  return (
    <ParentSize>
      {(parent) => (
        <StaticLinearChart parentWidth={parent.width} parentHeight={parent.height} {...props} />
      )}
    </ParentSize>
  );
}
