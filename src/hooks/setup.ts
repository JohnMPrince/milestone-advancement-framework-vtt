// src/hooks/setup.ts
import { MODULE } from '../core/constants.js';

Hooks.once('setup', () => {
  console.log(`${MODULE.NAME} | Setup`);
});
