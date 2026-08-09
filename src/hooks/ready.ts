// src/hooks/ready.ts

import { MODULE } from '../core/constants.js';
import { MAFService } from '../services/maf-service.js';

Hooks.once('ready', () => {
  const mafService = new MAFService();

  mafService.initialise();
  game.maf = mafService;

  console.log(`${MODULE.NAME} | Ready`);
});
