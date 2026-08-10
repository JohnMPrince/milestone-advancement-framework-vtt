// src/core/settings.ts

import { MODULE } from './constants/core';
import { SETTINGS } from './constants/settings';

interface ModuleSettingConfig {
  name: string;
  hint: string;
  scope: 'client' | 'world';
  config: boolean;
  type: typeof Boolean;
  default: boolean;
}

interface ModuleSettings {
  register(namespace: string, key: string, data: ModuleSettingConfig): void;
}

const showStartupDialogSetting: ModuleSettingConfig = {
  name: 'MAF.Settings.ShowStartupDialog.Name',
  hint: 'MAF.Settings.ShowStartupDialog.Hint',
  scope: 'client',
  config: true,
  type: Boolean,
  default: true,
};

const debugModeSetting: ModuleSettingConfig = {
  name: 'MAF.Settings.DebugMode.Name',
  hint: 'MAF.Settings.DebugMode.Hint',
  scope: 'client',
  config: true,
  type: Boolean,
  default: false,
};

export function registerSettings(): void {
  const initGame = game as InitGame;
  const settings = initGame.settings as ModuleSettings;

  settings.register(MODULE.ID, SETTINGS.SHOW_STARTUP_DIALOG, showStartupDialogSetting);
  settings.register(MODULE.ID, SETTINGS.DEBUG_MODE, debugModeSetting);
}
