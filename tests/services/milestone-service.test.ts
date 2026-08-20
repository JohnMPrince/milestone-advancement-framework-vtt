// tests/services/milestone-service.test.ts

import { describe, it, expect } from 'vitest';
import { Milestone, MilestoneAward } from '../../src/domain';
import { MilestoneService, MilestoneRegistrationService } from '../../src/services';

describe('MilestoneService', () => {
  describe('awardMilestone', () => {
    it('awards a registered milestone successfully', () => {
      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const registrationService = new MilestoneRegistrationService();
      registrationService.register(milestone);

      const service = new MilestoneService(registrationService);

      const award = service.awardMilestone('defeat-strahd', 'test-gm', new Date());

      expect(award).toBeInstanceOf(MilestoneAward);
    });

    it('records the milestone that was awarded', () => {
      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const registrationService = new MilestoneRegistrationService();
      registrationService.register(milestone);

      const service = new MilestoneService(registrationService);

      const award = service.awardMilestone('defeat-strahd', 'test-gm', new Date());

      expect(award).toBeInstanceOf(MilestoneAward);
      expect(award.milestoneKey).toBe(milestone.key);
    });
  });
});
