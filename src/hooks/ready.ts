// src/hooks/ready.ts
import { MODULE } from '../core/constants.js';

Hooks.once('ready', () => {
  console.log(`${MODULE.NAME} | Ready`);
});
