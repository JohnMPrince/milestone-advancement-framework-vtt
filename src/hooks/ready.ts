// src/hooks/ready.ts

import { MODULE } from '../core/constants/core';
import { MilestoneAdvancementService } from '../services/milestone-advancement-service';

Hooks.once('ready', () => {
  const service = new MilestoneAdvancementService();

  service.initialise();

  game.maf = {
    service,
  };

  console.log(`${MODULE.NAME} | Ready`);
});
