'use client';

import { useQuery } from '@tanstack/react-query';
import { formatPercent, formatTvl } from '~/lib/formatters';
import { apiKeys } from '~/lib/queryKeys';
import { VaultHistoricData } from '~/lib/vault';
import { LinearChart } from '~/ui/LinearChart/LinearChart';
import { getVaultHistoricData } from '../api';
import { DEFAULT_CHART_RANGE, useChartStore } from '../stores';

const getTvl = (d: VaultHistoricData) => Number(d.tvl);
const getApy = (d: VaultHistoricData) => d.apy;

interface Props {
  initialData: VaultHistoricData[];
  slug: string;
}

export function HistoryChart({ initialData, slug }: Props): JSX.Element {
  const { range, type } = useChartStore();

  const getY = type === 'tvl' ? getTvl : getApy;
  const formatY = type === 'tvl' ? formatTvl : formatPercent;

  const { data: chartData = [] } = useQuery({
    queryKey: apiKeys.chartHistory(slug, range),
    queryFn: () => getVaultHistoricData(slug, range),
    initialData: () => {
      if (range === DEFAULT_CHART_RANGE) {
        return initialData;
      }
    },
    keepPreviousData: true,
  });

  return <LinearChart data={chartData} formatY={formatY} getY={getY} />;
}
