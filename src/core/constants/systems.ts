// src/core/constants/systems.ts

export const SUPPORTED_SYSTEMS = {
  DND5E: 'dnd5e',
  PF2E: 'pf2e',
} as const;

export type SupportedSystemId = (typeof SUPPORTED_SYSTEMS)[keyof typeof SUPPORTED_SYSTEMS];
