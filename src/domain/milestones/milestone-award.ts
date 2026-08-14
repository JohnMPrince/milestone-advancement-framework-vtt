// src/domain/milestones/milestone-award.ts
import type { MAFIdentity } from '../identity';

export interface MilestoneAwardData {
  milestoneKey: string;
  awardedBy: MAFIdentity;
  awardedAt: Date;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export class MilestoneAward {
  public readonly milestoneKey: string;
  public readonly awardedBy: MAFIdentity;
  public readonly awardedAt: Date;
  reason?: string;
  metadata?: Record<string, unknown>;

  constructor(data: MilestoneAwardData) {
    if (data.milestoneKey.length === 0 || /\s/.test(data.milestoneKey)) {
      throw new Error(
        'MilestoneAward milestoneKey must be non-empty and must not contain whitespace',
      );
    }

    if (data.awardedBy.trim().length === 0) {
      throw new Error('MilestoneAward awardedBy must not be empty');
    }

    if (Number.isNaN(data.awardedAt.getTime())) {
      throw new Error('MilestoneAward awardedAt must be a valid date');
    }

    if (data.reason !== undefined && data.reason.trim().length === 0) {
      throw new Error('MilestoneAward reason, if specified, must be non-empty');
    }

    this.milestoneKey = data.milestoneKey;
    this.awardedBy = data.awardedBy;
    this.awardedAt = data.awardedAt;
    this.reason = data.reason;
    this.metadata = data.metadata;
  }
}
