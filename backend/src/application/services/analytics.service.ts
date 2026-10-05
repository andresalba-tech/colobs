import {
  ITechnologyRepository,
  IAnalyticsRepository,
} from '../../core/interfaces/repositories.js';
import {
  TechnologyRecord,
  TimelineDataPoint,
  SeriesSummary,
} from '../../core/types.js';

export class AnalyticsService {
  constructor(
    private readonly techRepository: ITechnologyRepository,
    private readonly analyticsRepository: IAnalyticsRepository
  ) {}

  getAvailableSeries(): TechnologyRecord[] {
    return this.techRepository.getAll();
  }

  parseSlugs(seriesParam: string | null): string[] {
    const raw = seriesParam || 'react,python,java';
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  getTimelineData(
    slugs: string[],
    metric: 'new' | 'active' = 'new',
    days: number = 30
  ): TimelineDataPoint[] {
    return this.analyticsRepository.getTimelineData(slugs, metric, days);
  }

  getSeriesSummaries(slugs: string[], days: number = 30): SeriesSummary[] {
    return slugs
      .map((slug) => this.analyticsRepository.getSeriesCardSummary(slug, days))
      .filter((s): s is SeriesSummary => s !== null);
  }
}
