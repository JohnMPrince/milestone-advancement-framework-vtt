// src/hooks/setup.ts

import { MilestoneAdvancementService } from '../services/milestone-advancement-service';
import { MODULE } from '../core/constants/core';

import type { ILogger } from '../services/logger-interface';

export function registerSetupHook(logger: ILogger): void {
  Hooks.once('setup', () => {
    try {
      logger.info('Foundry setup phase started');

      const service = new MilestoneAdvancementService(logger);
      service.initialise();

      game.maf = {
        service,
      };

      logger.info(`${MODULE.NAME} runtime initialised`);
    } catch (error) {
      logger.error(`Failed to initialise ${MODULE.NAME} runtime`, error);
      throw error;
    }
  });
}
