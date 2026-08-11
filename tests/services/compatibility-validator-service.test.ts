// tests/services/compatiblity-validator-services-test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompatibilityValidatorService } from '../../src/services/compatibility-validator-service';

describe('CompatibilityValidatorService', () => {
  beforeEach(() => {
    vi.stubGlobal('game', {
      system: {
        id: 'test-system',
      },
    });
  });

  it('returns compatible when the Foundry runtime and game system are available', () => {
    const validator = new CompatibilityValidatorService();
    const result = validator.validate();

    expect(result.status).toBe('compatible');
    expect(result.message).toBe('Foundry VTT runtime is available.');
  });

  it('returns incompatible when the Foundry runtime is unavailable', () => {
    vi.stubGlobal('game', undefined);

    const validator = new CompatibilityValidatorService();
    const result = validator.validate();

    expect(result.status).toBe('incompatible');
    expect(result.message).toBe('Foundry VTT runtime is unavailable.');
  });

  it('returns incompatible when the game system is unavailable', () => {
    vi.stubGlobal('game', {
      system: undefined,
    });

    const validator = new CompatibilityValidatorService();
    const result = validator.validate();

    expect(result.status).toBe('incompatible');
    expect(result.message).toBe('Foundry VTT game system is unavailable.');
  });
});
