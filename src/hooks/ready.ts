// src/hooks/ready.ts
import { MODULE } from '../core/constants/core';
import { CompatibilityValidatorService } from '../services';

import type { ILogger } from '../services/logger-interface';

export function registerReadyHook(logger: ILogger): void {
  Hooks.once('ready', () => {
    try {
      logger.info('Foundry ready phase started');

      const readyGame = game as ReadyGame;
      logger.debug(`Game system detected: ${readyGame.system.id}`);

      const compatibilityValidator = new CompatibilityValidatorService();
      const compatibilityResult = compatibilityValidator.validate();

      logger.info(`Compatibility validation: ${compatibilityResult.message}`);

      if (compatibilityResult.status === 'incompatible') {
        logger.error(`Compatibility validation failed: ${compatibilityResult.message}`);
        return;
      }

      logger.info(`${MODULE.NAME} module ready`);
    } catch (error) {
      logger.error('Failed during Foundry ready phase', error);
      throw error;
    }
  });
}
