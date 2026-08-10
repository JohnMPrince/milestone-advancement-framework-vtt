// src/adapters/system-adapter-manager.ts

import { ISystemAdapter } from './system-adapter-interface';

export class SystemAdapterManager {
  private readonly registeredAdapters = new Map<string, ISystemAdapter>();

  public register(adapter: ISystemAdapter): void {
    this.registeredAdapters.set(adapter.getSystemId(), adapter);
  }

  public resolveAdapter(systemId: string): ISystemAdapter | null {
    return this.registeredAdapters.get(systemId) ?? null;
  }
}
