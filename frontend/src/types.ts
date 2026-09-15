export interface Technology {
  id: number;
  name: string;
  slug: string;
  category: 'language' | 'frontend' | 'backend' | 'ai' | 'role';
}

export type MetricType = 'new' | 'active';

export interface PeriodOption {
  label: string;
  days: number;
}

export interface TimelineDataPoint {
  date: string;
  [seriesSlug: string]: number | string;
}

export interface SeriesSummary {
  slug: string;
  name: string;
  category: string;
  totalActive: number;
  newInPeriod: number;
  changePercent: number;
}
