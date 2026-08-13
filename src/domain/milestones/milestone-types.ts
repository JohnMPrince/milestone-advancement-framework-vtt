// src/domain/milestones/milestone-types.ts

export const MILESTONE_TYPES = [
  'completed-quest',
  'acquired-significant-item',
  'defeated-boss',
] as const;

export type MilestoneType = (typeof MILESTONE_TYPES)[number];
