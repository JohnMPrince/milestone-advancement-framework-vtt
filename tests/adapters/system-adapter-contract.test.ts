// tests/adapters/system-adapter-contract.test.ts

import { describe, expect, it } from 'vitest';
import { Dnd5eSystemAdapter } from '../../src/adapters/systems/system-adapter-dnd5e';
import { SUPPORTED_SYSTEMS } from '../../src/core/constants/systems';

describe('System Adapter Contract', () => {
  it('should provide a system id', () => {
    const adapter = new Dnd5eSystemAdapter();

    expect(adapter.getSystemId()).toBe(SUPPORTED_SYSTEMS.DND5E);
  });

  it('should provide required adapter methods', () => {
    const adapter = new Dnd5eSystemAdapter();

    expect(adapter.getParty).toBeDefined();

    expect(adapter.getCharacterLevel).toBeDefined();
  });
});
