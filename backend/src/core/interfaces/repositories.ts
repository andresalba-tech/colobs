import {
  TechnologyRecord,
  TimelineDataPoint,
  SeriesSummary,
  GeneralStats,
  RecordEventDTO,
  CreateContactDTO,
} from '../types.js';

export interface IJobsRepository {
  getTotalJobsCount(): number;
  getGeneralStats(): GeneralStats;
}

export interface ITechnologyRepository {
  getAll(): TechnologyRecord[];
  getBySlug(slug: string): TechnologyRecord | undefined;
}

export interface IAnalyticsRepository {
  getTimelineData(
    slugs: string[],
    metric: 'new' | 'active',
    days: number
  ): TimelineDataPoint[];
  getSeriesCardSummary(slug: string, days: number): SeriesSummary | null;
}

export interface IVisitorRepository {
  recordEvent(event: RecordEventDTO): void;
  recordContact(contact: CreateContactDTO): void;
  getVisitorAnalyticsReport(): any;
}
