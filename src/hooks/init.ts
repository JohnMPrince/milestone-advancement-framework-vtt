// src/hooks/init.ts

import { MODULE } from '../core/constants/core';
import { registerSettings } from '../core/settings';

Hooks.once('init', () => {
  console.log(`${MODULE.NAME} | Initialisation started.`);
  registerSettings();
  console.log(`${MODULE.NAME} | Initialisation completed.`);
});
