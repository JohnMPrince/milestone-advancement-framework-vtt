// tests/services/milestone-regisration-service.test.ts

import { describe, expect, it } from 'vitest';

import { Milestone } from '../../src/domain';
import { MilestoneRegistrationService } from '../../src/services';

describe('MilestoneRegistrationService', () => {
  describe('register', () => {
    it('registers a valid milestone successfully', () => {
      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const service = new MilestoneRegistrationService();

      expect(() => service.register(milestone)).not.toThrow();
    });

    it('make a registered milestone available for retrieval', () => {
      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const service = new MilestoneRegistrationService();

      service.register(milestone);

      expect(service.get('defeat-strahd')).toBe(milestone);
    });

    it('uses the milestone key as its registration identity', () => {
      const milestoneA = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat the Vampire',
        description: 'The party defeats the vampire.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const milestoneB = new Milestone({
        key: 'defeat-vampire',
        name: 'Defeat the Vampire',
        description: 'The party defeats the vampire.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const service = new MilestoneRegistrationService();

      service.register(milestoneA);
      service.register(milestoneB);

      expect(service.get('defeat-strahd')).toBe(milestoneA);
      expect(service.get('defeat-vampire')).toBe(milestoneB);
    });

    it('rejects duplicate milestone registration', () => {
      const originalMilestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const duplicateMilestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd Clone',
        description: 'The party defeats Strahd clone to demonstrate a duplicate milestone key.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const service = new MilestoneRegistrationService();

      service.register(originalMilestone);

      expect(() => service.register(duplicateMilestone)).toThrow(
        'Milestone with key "defeat-strahd" is already registered',
      );
      expect(service.get('defeat-strahd')).toBe(originalMilestone);
    });

    it('retains domain information and metadata for a registered milestone', () => {
      const metadata = {
        campaign: 'Curse of Strahd',
        importance: 'major',
      };

      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        type: 'defeated-boss',
        createdBy: 'test-gm',
        createdAt: new Date('2026-08-16T12:00:00Z'),
        metadata,
      });

      const service = new MilestoneRegistrationService();

      service.register(milestone);

      const registeredMilestone = service.get('defeat-strahd');

      expect(registeredMilestone).toEqual(milestone);
      expect(registeredMilestone?.metadata).toEqual(metadata);
    });

    it('does not register a milestone when it is created', () => {
      const milestone = new Milestone({
        key: 'defeat-strahd',
        name: 'Defeat Strahd',
        description: 'The party defeats Strahd von Zarovich.',
        createdBy: 'test-gm',
        createdAt: new Date(),
      });

      const service = new MilestoneRegistrationService();

      expect(service.get(milestone.key)).toBeUndefined();
    });
  });
});
