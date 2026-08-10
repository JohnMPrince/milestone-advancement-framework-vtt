// src/hooks/index.ts

import { registerInitHook } from './init';
import { registerReadyHook } from './ready';
import { registerSetupHook } from './setup';
import type { ILogger } from '../services/logger-interface';

export function registerHooks(logger: ILogger): void {
  registerInitHook(logger);
  registerSetupHook(logger);
  registerReadyHook(logger);
}
