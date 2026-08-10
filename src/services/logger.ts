// src/services/logger.ts

import { MODULE } from '../core/constants/core';
import { SETTINGS } from '../core/constants/settings';

import type { ILogger } from './logger-interface';

interface ModuleSettings {
  get(namespace: string, key: string): string;
}

export class Logger implements ILogger {
  private readonly scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  info(message: string, ...args: unknown[]): void {
    console.info(this.format(message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.format(message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.format(message), ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    const settings = (game as Game).settings as ModuleSettings;

    const enabled = settings.get(MODULE.ID, SETTINGS.DEBUG_MODE);

    if (!enabled) {
      return;
    }

    console.debug(this.format(message), ...args);
  }

  private format(message: string): string {
    return `${this.scope} | ${message}`;
  }
}
