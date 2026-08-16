// src/services/milestone-registration-service.ts
import type { Milestone } from '../domain';
import type { IMilestoneRegistrationService } from './milestone-registration-service-interface';

export class MilestoneRegistrationService implements IMilestoneRegistrationService {
  private readonly milestones = new Map<string, Milestone>();

  register(milestone: Milestone): void {
    // Check if the Milestone Key is already registered - report back with an error if this occurs
    if (this.milestones.has(milestone.key)) {
      throw new Error(`Milestone with key "${milestone.key}" is already registered`);
    }

    this.milestones.set(milestone.key, milestone);
  }

  get(key: string): Milestone | undefined {
    return this.milestones.get(key);
  }
}
