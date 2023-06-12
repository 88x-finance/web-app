import { create } from 'zustand';

export type ChartType = 'apy' | 'tvl';
export type ChartRange = '1w' | '1m' | '1y';

interface ChartStore {
  type: ChartType;
  range: ChartRange;
  setType: (type: ChartType) => void;
  setRange: (range: ChartRange) => void;
}

export const DEFAULT_CHART_RANGE = '1w';

export const useChartStore = create<ChartStore>((set) => ({
  type: 'apy',
  range: DEFAULT_CHART_RANGE,
  setRange: (range) => set({ range }),
  setType: (type) => set({ type }),
}));
