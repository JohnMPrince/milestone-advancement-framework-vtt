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
  });
});
