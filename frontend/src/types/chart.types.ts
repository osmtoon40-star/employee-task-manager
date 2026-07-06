export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface ComparisonData {
  category: string;
  actual: number;
  expected: number;
}

export interface DistributionData {
  name: string;
  value: number;
  color?: string;
}
