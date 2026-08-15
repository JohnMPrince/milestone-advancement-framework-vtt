// tests/domain/milestones/milestone.test.ts
import { describe, it, expect } from 'vitest';
import { Milestone } from '../../../src/domain/milestones';

import type { MilestoneType } from '../../../src/domain/milestones';

describe('Milestone', () => {
  it('should create a valid milestone', () => {
    const createdAt = new Date('2026-08-13T00:00:00Z');

    const milestone = new Milestone({
      key: 'defeat-strahd',
      name: 'Defeat Strahd',
      description: 'The party defeats Strahd von Zarovich.',
      type: 'defeated-boss',
      createdBy: 'gm',
      createdAt: createdAt,
      metadata: {
        campaign: 'Curse of Strahd',
      },
    });

    expect(milestone.key).toBe('defeat-strahd');
    expect(milestone.name).toBe('Defeat Strahd');
    expect(milestone.description).toBe('The party defeats Strahd von Zarovich.');
    expect(milestone.type).toBe('defeated-boss');
    expect(milestone.createdBy).toBe('gm');
    expect(milestone.createdAt).toBe(createdAt);
    expect(milestone.metadata).toEqual({
      campaign: 'Curse of Strahd',
    });
  });

  it('should reject an empty key', () => {
    expect(
      () =>
        new Milestone({
          key: '',
          name: 'Defeat Strahd',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone key must be non-empty and must not contain whitespace');
  });

  it('should reject a key containing whitespace', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat strahd',
          name: 'Defeat Strahd',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone key must be non-empty and must not contain whitespace');
  });

  it('should reject an empty name', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: '',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone name must be non-empty');
  });

  it('should reject a whitespace-only name', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: '   ',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone name must be non-empty');
  });

  it('should reject an empty description', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          description: '',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone description, if specified, must be non-empty');
  });

  it('should reject a whitespace-only description', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          description: '   ',
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone description, if specified, must be non-empty');
  });

  it('should accept a valid milestone type', () => {
    const milestone = new Milestone({
      key: 'defeat-strahd',
      name: 'Defeat Strahd',
      type: 'defeated-boss',
      createdBy: 'gm',
      createdAt: new Date(),
    });

    expect(milestone.type).toBe('defeated-boss');
  });

  it('should reject an invalid milestone type', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          type: 'invalid-type' as MilestoneType,
          createdBy: 'gm',
          createdAt: new Date(),
        }),
    ).toThrow('Invalid milestone type: invalid-type');
  });

  it('should reject an empty createdBy identity', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          createdBy: '',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone createdBy must not be empty');
  });

  it('should reject a whitespace-only createdBy identity', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          createdBy: '   ',
          createdAt: new Date(),
        }),
    ).toThrow('Milestone createdBy must not be empty');
  });

  it('should reject an invalid createdAt date', () => {
    expect(
      () =>
        new Milestone({
          key: 'defeat-strahd',
          name: 'Defeat Strahd',
          createdBy: 'gm',
          createdAt: new Date('invalid-date'),
        }),
    ).toThrow('Milestone createdAt must be a valid date');
  });

  it('should create a milestone without optional fields', () => {
    const milestone = new Milestone({
      key: 'defeat-strahd',
      name: 'Defeat Strahd',
      createdBy: 'gm',
      createdAt: new Date(),
    });

    expect(milestone.description).toBeUndefined();
    expect(milestone.type).toBeUndefined();
    expect(milestone.metadata).toBeUndefined();
  });

  it('should preserve milestone metadata', () => {
    const metadata = {
      campaign: 'Curse of Strahd',
      chapter: 5,
      customValue: true,
    };

    const milestone = new Milestone({
      key: 'defeat-strahd',
      name: 'Defeat Strahd',
      createdBy: 'gm',
      createdAt: new Date(),
      metadata,
    });

    expect(milestone.metadata).toEqual(metadata);
  });
});
