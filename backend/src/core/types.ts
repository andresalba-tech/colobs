export interface TechnologyRecord {
  id: number;
  name: string;
  slug: string;
  category: string;
}

export interface TimelineDataPoint {
  date: string;
  [techSlug: string]: number | string;
}

export interface SeriesSummary {
  slug: string;
  name: string;
  category: string;
  totalActive: number;
  newInPeriod: number;
  changePercent: number;
}

export interface GeneralStats {
  totalJobs: number;
  totalCompanies: number;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  visitorInteractions: number;
  leadsReceived: number;
  topTechnologies: Array<{
    name: string;
    slug: string;
    category: string;
    total: number;
  }>;
}

export interface HealthStatus {
  status: string;
  jobsStored: number;
  timestamp: string;
}

export interface RecordEventDTO {
  event_type?: string;
  series?: string;
  period?: string | number;
}

export interface CreateContactDTO {
  name?: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  country?: string;
  comment?: string;
  authorized?: boolean;
}
