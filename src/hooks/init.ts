// src/hooks/init.ts

import { MODULE } from '../core/constants/core';

Hooks.once('init', () => {
  console.log(`${MODULE.NAME} | Initialising`);
});
