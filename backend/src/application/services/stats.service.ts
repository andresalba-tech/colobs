import { IJobsRepository } from '../../core/interfaces/repositories.js';
import { GeneralStats, HealthStatus } from '../../core/types.js';

export class StatsService {
  constructor(private readonly jobsRepository: IJobsRepository) {}

  getHealth(): HealthStatus {
    const jobsStored = this.jobsRepository.getTotalJobsCount();
    return {
      status: 'ok',
      jobsStored,
      timestamp: new Date().toISOString(),
    };
  }

  getGeneralStats(): GeneralStats {
    return this.jobsRepository.getGeneralStats();
  }
}
