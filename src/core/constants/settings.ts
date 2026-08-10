// src/core/constants/settings.ts

export const SETTINGS = {
  SHOW_STARTUP_DIALOG: 'showStartupDialog',
  DEBUG_MODE: 'debugMode',
} as const;

export type MAPSettingKey = (typeof SETTINGS)[keyof typeof SETTINGS];
