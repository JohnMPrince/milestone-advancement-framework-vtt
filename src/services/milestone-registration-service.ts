// src/services/milestone-registration-service.ts
import type { Milestone } from '../domain';
import type { IMilestoneRegistrationService } from './milestone-registration-service-interface';

export class MilestoneRegistrationService implements IMilestoneRegistrationService {
  private readonly milestones = new Map<string, Milestone>();

  register(milestone: Milestone): void {
    this.milestones.set(milestone.key, milestone);
  }

  get(key: string): Milestone | undefined {
    return this.milestones.get(key);
  }
}
