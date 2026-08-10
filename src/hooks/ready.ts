// src/hooks/ready.ts
import { MODULE } from '../core/constants/core';

import type { ILogger } from '../services/logger-interface';

export function registerReadyHook(logger: ILogger): void {
  Hooks.once('ready', () => {
    try {
      logger.info('Foundry ready phase started');

      const readyGame = game as ReadyGame;
      logger.debug(`Game system detected: ${readyGame.system.id}`);

      logger.info(`${MODULE.NAME} module ready`);
    } catch (error) {
      logger.error('Failed during Foundry ready phase', error);
      throw error;
    }
  });
}
