import { IVisitorRepository } from '../../core/interfaces/repositories.js';
import { RecordEventDTO, CreateContactDTO } from '../../core/types.js';

export class VisitorService {
  constructor(private readonly visitorRepository: IVisitorRepository) {}

  recordEvent(dto: RecordEventDTO): { success: boolean } {
    this.visitorRepository.recordEvent({
      event_type: dto.event_type || 'comparison_view',
      series: dto.series || '',
      period: dto.period || '',
    });
    return { success: true };
  }

  recordContact(dto: CreateContactDTO): { success: boolean; message: string } {
    this.visitorRepository.recordContact({
      name: dto.name || 'Anónimo',
      company: dto.company || '',
      role: dto.role || '',
      email: dto.email || '',
      phone: dto.phone || '',
      country: dto.country || 'Colombia',
      comment: dto.comment || '',
    });
    return { success: true, message: 'Contacto registrado correctamente' };
  }

  isAuthorizedAdmin(providedKey: string | null | undefined, adminKey: string): boolean {
    if (!providedKey) return false;
    return providedKey.trim() === adminKey.trim();
  }

  getAnalyticsReport(): any {
    return this.visitorRepository.getVisitorAnalyticsReport();
  }
}
