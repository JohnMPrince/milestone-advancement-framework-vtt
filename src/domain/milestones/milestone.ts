// src/domain.milestones/milestone.ts
import { MILESTONE_TYPES } from './milestone-types';

import type { MAFIdentity } from '../identity';
import type { MilestoneType } from './milestone-types';

export interface MilestoneData {
  key: string;
  name: string;
  description?: string;
  type?: MilestoneType;
  createdBy: MAFIdentity;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export class Milestone {
  public readonly key: string;
  name: string;
  description?: string;
  type?: MilestoneType;
  public readonly createdBy: MAFIdentity;
  public readonly createdAt: Date;
  metadata?: Record<string, unknown>;

  constructor(data: MilestoneData) {
    if (data.key.length === 0 || /\s/.test(data.key)) {
      throw new Error('Milestone key must be non-empty and must not contain whitespace');
    }

    if (data.name.trim().length === 0) {
      throw new Error('Milestone name must be non-empty');
    }

    if (data.description !== undefined && data.description.trim().length === 0) {
      throw new Error('Milestone description, if specified, must be non-empty');
    }

    if (data.type !== undefined && !MILESTONE_TYPES.includes(data.type)) {
      throw new Error(`Invalid milestone type: ${data.type}`);
    }

    if (data.createdBy.trim().length === 0) {
      throw new Error('Milestone createdBy must not be empty');
    }

    if (Number.isNaN(data.createdAt.getTime())) {
      throw new Error('Milestone createdAt must be a valid date');
    }

    this.key = data.key;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.metadata = data.metadata;
  }
}
