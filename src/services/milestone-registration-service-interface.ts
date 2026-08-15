// src/services/milestone-registration-service-interface.ts
import type { Milestone } from '../domain';

export interface IMilestoneRegistrationService {
  register(milestone: Milestone): void;
  get(key: string): Milestone | undefined;
}
