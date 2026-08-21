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

    it('preserves the original milestone definition when awarded', () => {
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

      service.awardMilestone('defeat-strahd', 'test-gm', new Date());

      expect(registrationService.get('defeat-strahd')).toEqual(milestone);
    });

    it('identity responsible for awarding the milestone is recorded', () => {
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
      expect(award.awardedBy).toBe('test-gm');
    });

    it('timestamp of when the award is awarded is recorded', () => {
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

      const awardedAt = new Date('2026-08-21T12:00:00Z');

      const award = service.awardMilestone('defeat-strahd', 'test-gm', awardedAt);

      expect(award.awardedAt).toBe(awardedAt);
    });

    it('records the reason provided for awarding the milestone', () => {
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

      const reason = 'The party defeated Strahd and ended his reign over Barovia.';

      const award = service.awardMilestone('defeat-strahd', 'test-gm', new Date(), reason);

      expect(award.reason).toBe(reason);
    });
  });
});
