// src/hooks/init.ts

import { registerSettings } from '../core/settings';

import type { ILogger } from '../services/logger-interface';

export function registerInitHook(logger: ILogger): void {
  Hooks.once('init', () => {
    logger.info('Foundry init phase started');
    try {
      logger.info('Registering module settings with Foundry');
      registerSettings();
    } catch (error) {
      logger.error('Failed to register settings for the module', error);
      throw error;
    }

    logger.info('Foundry init phase completed');
  });
}
