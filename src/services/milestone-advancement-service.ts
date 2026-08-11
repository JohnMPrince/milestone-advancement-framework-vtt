// src/services/milestone-advancement-service.ts

import { ISystemAdapter } from '../adapters/system-adapter-interface';
import { SystemAdapterManager } from '../adapters/system-adapter-manager';
import { Dnd5eSystemAdapter } from '../adapters/systems/system-adapter-dnd5e';
import { MilestoneService } from './milestone-service';
import { SUPPORTED_SYSTEMS } from '../core/constants/systems';

import type { ILogger } from './logger-interface';

export class MilestoneAdvancementService {
  public readonly milestone: MilestoneService;
  public readonly adapterManager: SystemAdapterManager;
  private _systemAdapter: ISystemAdapter | null = null;

  constructor(private readonly logger: ILogger) {
    this.adapterManager = new SystemAdapterManager();
    this.milestone = new MilestoneService();
  }

  public initialise(): void {
    try {
      this.logger.info('Initialising Milestone Advancement Service');

      this.logger.debug('Registering System Adapters: started');
      this.registerSystemAdapters();
      this.logger.debug('Registering System Adapters: completed');

      this.logger.debug('Resolving System Adapters: started');
      this.resolveSystemAdapter();
      this.logger.debug('Resolving System Adapters: completed');
    } catch (error) {
      this.logger.error('Failed to initialise Milestone Advancement Service', error);
      throw error;
    }
  }

  public get systemAdapter(): ISystemAdapter | null {
    return this._systemAdapter;
  }

  private registerSystemAdapters(): void {
    this.logger.debug(
      `Request for System Adapter registration: ${SUPPORTED_SYSTEMS.DND5E}: requested`,
    );
    this.adapterManager.register(new Dnd5eSystemAdapter()); // Register DnD5e as the Initial system. This list will grow.
    this.logger.debug(
      `Request for System Adapter registration: ${SUPPORTED_SYSTEMS.DND5E}: approved`,
    );
  }

  private resolveSystemAdapter(): void {
    if (!game.system) {
      this.logger.warn('Unable to determine active game system');
      return;
    }

    this._systemAdapter = this.adapterManager.resolveAdapter(game.system.id);

    if (!this.systemAdapter) {
      this.logger.warn(`No system adapter available for ${game.system.id}`);
    } else {
      this.logger.info(`System adapter for ${game.system.id} resolved`);
    }
  }
}
