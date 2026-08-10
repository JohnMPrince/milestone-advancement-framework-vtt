// main.ts

import { MODULE } from './core/constants/core';
import { Logger } from './services/logger';
import { registerInitHook } from './hooks/init';
import { registerReadyHook } from './hooks/ready';
import { registerSetupHook } from './hooks/setup';

const logger = new Logger(MODULE.LOG_PREFIX);

registerInitHook(logger);
registerSetupHook(logger);
registerReadyHook(logger);
