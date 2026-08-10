// src/services/milestone-advancement-service.ts

import { ISystemAdapter } from '../adapters/system-adapter-interface';
import { SystemAdapterManager } from '../adapters/system-adapter-manager';
import { Dnd5eSystemAdapter } from '../adapters/systems/system-adapter-dnd5e';
import { MilestoneService } from './milestone-service';
import { MODULE } from '../core/constants/core';

export class MilestoneAdvancementService {
  public readonly milestone: MilestoneService;
  public readonly adapterManager: SystemAdapterManager;
  private _systemAdapter: ISystemAdapter | null = null;

  constructor() {
    this.adapterManager = new SystemAdapterManager();
    this.milestone = new MilestoneService();
  }

  public initialise(): void {
    this.registerSystemAdapters();
    this.resolveSystemAdapter();
  }

  public get systemAdapter(): ISystemAdapter | null {
    return this._systemAdapter;
  }

  private registerSystemAdapters(): void {
    this.adapterManager.register(new Dnd5eSystemAdapter()); // Register DnD5e as the Initial system. This list will grow.
  }

  private resolveSystemAdapter(): void {
    if (!game.system) {
      console.warn(`${MODULE.NAME} | Unable to determine active game system.`);
      return;
    }

    this._systemAdapter = this.adapterManager.resolveAdapter(game.system.id);

    if (!this.systemAdapter) {
      console.warn(`${MODULE.NAME} | No system adapter available for ${game.system.id}.`);
    }
  }
}
