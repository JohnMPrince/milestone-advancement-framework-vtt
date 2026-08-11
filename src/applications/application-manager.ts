// src/applications/application-manager.ts

import { ILogger } from '../services/logger-interface';
import { MAFApplication } from './base/maf-application';

export class ApplicationManager {
  constructor(private readonly logger: ILogger) {}

  openMainApplication(): void {
    const readyGame = game as ReadyGame;

    this.logger.debug('Open Main Application function: Started');
    if (!readyGame.maf.service.systemAdapter) {
      this.logger.debug('UI will not be displayed as not a supported system');
    } else {
      const application = new MAFApplication();
      application.render({ force: true });
    }

    this.logger.debug('Open Main Application function: Completed');
  }
}
