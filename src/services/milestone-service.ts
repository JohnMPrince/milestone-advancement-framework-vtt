// src/services/milestone-service.ts

import { MAFIdentity, MilestoneAward } from '../domain';
import { IMilestoneRegistrationService } from './milestone-registration-service-interface';
import { IMilestoneService } from './milestone-service-interface';

export class MilestoneService implements IMilestoneService {
  constructor(private readonly registrationService: IMilestoneRegistrationService) {}

  awardMilestone(milestoneKey: string, awardedBy: MAFIdentity, awardedAt: Date): MilestoneAward {
    const milestone = this.registrationService.get(milestoneKey);
    if (milestone === undefined) {
      throw Error(`Milestone with key ${milestoneKey} is unregistered or does not exist`);
    }

    const milestoneAward = new MilestoneAward({
      milestoneKey: milestone.key,
      awardedBy: awardedBy,
      awardedAt: awardedAt,
    });

    return milestoneAward;
  }
}
