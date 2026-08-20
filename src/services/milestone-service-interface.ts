// src/services/milestone-service-interface.ts

import { MAFIdentity, MilestoneAward } from '../domain';

export interface IMilestoneService {
  awardMilestone(milestoneKey: string, awardedBy: MAFIdentity, awardedAt: Date): MilestoneAward;
}
