// tests/adapters/system-adapter-manager.test.ts

import { describe, expect, it } from 'vitest';
import { Dnd5eSystemAdapter } from '../../src/adapters/systems/system-adapter-dnd5e';
import { SystemAdapterManager } from '../../src/adapters/system-adapter-manager';
import { SUPPORTED_SYSTEMS } from '../../src/core/constants/systems';

describe('SystemAdapterManager', () => {
  it('should register and resolve an adapter', () => {
    const manager = new SystemAdapterManager();
    const adapter = new Dnd5eSystemAdapter();

    manager.register(adapter); // Register the Adapter

    const resolved = manager.resolveAdapter(SUPPORTED_SYSTEMS.DND5E);

    expect(resolved).toBe(adapter);
  });

  it('should return null for unsupported systems', () => {
    const manager = new SystemAdapterManager();

    const resolved = manager.resolveAdapter('unsupported-system');

    expect(resolved).toBeNull();
  });
});
