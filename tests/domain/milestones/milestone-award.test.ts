// tests/domain/milestones/milestone-award.test.ts
import { describe, expect, it } from 'vitest';
import { Milestone, MilestoneAward } from '../../../src/domain/milestones';

describe('MilestoneAward', () => {
  it('should create a valid milestone award', () => {
    const awardedAt = new Date('2026-08-14T00:00:00Z');

    const award = new MilestoneAward({
      milestoneKey: 'defeat-strahd',
      awardedBy: 'gm',
      awardedAt,
      reason: 'The party defeated Strahd in Castle Ravenloft.',
      metadata: {
        campaign: 'Curse of Strahd',
      },
    });

    expect(award.milestoneKey).toBe('defeat-strahd');
    expect(award.awardedBy).toBe('gm');
    expect(award.awardedAt).toBe(awardedAt);
    expect(award.reason).toBe('The party defeated Strahd in Castle Ravenloft.');
    expect(award.metadata).toEqual({
      campaign: 'Curse of Strahd',
    });
  });

  it('should reject an empty milestoneKey', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: '',
          awardedBy: 'gm',
          awardedAt: new Date(),
        }),
    ).toThrow('MilestoneAward milestoneKey must be non-empty and must not contain whitespace');
  });

  it('should reject a milestoneKey containing whitespace', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat strahd',
          awardedBy: 'gm',
          awardedAt: new Date(),
        }),
    ).toThrow('MilestoneAward milestoneKey must be non-empty and must not contain whitespace');
  });

  it('should reject an empty awardedBy identity', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat-strahd',
          awardedBy: '',
          awardedAt: new Date(),
        }),
    ).toThrow('MilestoneAward awardedBy must not be empty');
  });

  it('should reject a whitespace-only awardedBy identity', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat-strahd',
          awardedBy: '   ',
          awardedAt: new Date(),
        }),
    ).toThrow('MilestoneAward awardedBy must not be empty');
  });

  it('should reject an invalid awardedAt date', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat-strahd',
          awardedBy: 'gm',
          awardedAt: new Date('invalid-date'),
        }),
    ).toThrow('MilestoneAward awardedAt must be a valid date');
  });

  it('should reject an empty reason', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat-strahd',
          awardedBy: 'gm',
          awardedAt: new Date(),
          reason: '',
        }),
    ).toThrow('MilestoneAward reason, if specified, must be non-empty');
  });

  it('should reject a whitespace-only reason', () => {
    expect(
      () =>
        new MilestoneAward({
          milestoneKey: 'defeat-strahd',
          awardedBy: 'gm',
          awardedAt: new Date(),
          reason: '   ',
        }),
    ).toThrow('MilestoneAward reason, if specified, must be non-empty');
  });

  it('should create an award without a optional reason', () => {
    const award = new MilestoneAward({
      milestoneKey: 'defeat-strahd',
      awardedBy: 'gm',
      awardedAt: new Date(),
    });

    expect(award.reason).toBeUndefined();
  });

  it('should preserve milestone award metadata', () => {
    const metadata = {
      campaign: 'Curse of Strahd',
      session: 14,
      significant: true,
    };

    const award = new MilestoneAward({
      milestoneKey: 'defeat-strahd',
      awardedBy: 'gm',
      awardedAt: new Date(),
      metadata,
    });

    expect(award.metadata).toEqual(metadata);
  });

  it('should identify the milestone being awarded by its key', () => {
    const milestone = new Milestone({
      key: 'defeat-strahd',
      name: 'Defeat Strahd',
      createdBy: 'gm',
      createdAt: new Date(),
    });

    const award = new MilestoneAward({
      milestoneKey: 'defeat-strahd',
      awardedBy: 'gm',
      awardedAt: new Date(),
    });

    expect(award.milestoneKey).toBe(milestone.key);
  });
});
