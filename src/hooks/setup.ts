// src/hooks/setup.ts

import { MODULE } from '../core/constants/core';

Hooks.once('setup', () => {
  console.log(`${MODULE.NAME} | Setup`);
});
