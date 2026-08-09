// src/hooks/init.ts
import { MODULE } from '../core/constants.js';

Hooks.once('init', () => {
  console.log(`${MODULE.NAME} | Initialising`);
});
