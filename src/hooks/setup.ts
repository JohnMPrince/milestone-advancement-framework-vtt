// src/hooks/setup.ts

import { MilestoneAdvancementService } from '../services/milestone-advancement-service';
import { MODULE } from '../core/constants/core';

import type { ILogger } from '../services/logger-interface';
import { ApplicationManager } from '../applications';

export function registerSetupHook(logger: ILogger): void {
  Hooks.once('setup', () => {
    try {
      logger.info('Foundry setup phase started');

      const applications = new ApplicationManager(logger);
      const service = new MilestoneAdvancementService(logger);
      service.initialise();

      game.maf = {
        applications,
        service,
      };

      logger.info(`${MODULE.NAME} runtime initialised`);
    } catch (error) {
      logger.error(`Failed to initialise ${MODULE.NAME} runtime`, error);
      throw error;
    }
  });
}
