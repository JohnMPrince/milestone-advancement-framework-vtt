// src tests/hooks/ready.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MODULE } from '../../src/core/constants/core';

import type { ILogger } from '../../src/services/logger-interface';
import type { CompatibilityResult } from '../../src/types/compatibility';

/*
 * The mock is created with vi.hoisted() because Vitest evaluates module
 * mocks before normal module code. This ensures mockValidate exists when
 * the mocked CompatibilityValidatorService is created below.
 */
const { mockValidate } = vi.hoisted(() => ({
  mockValidate: vi.fn(),
}));

/*
 * Replace the real CompatibilityValidatorService with a lightweight
 * mock class. The real ready hook constructs this service with `new`,
 * so the mock must also be constructable.
 */
vi.mock('../../src/services/compatibility-validator-service', () => ({
  CompatibilityValidatorService: class {
    validate() {
      return mockValidate();
    }
  },
}));

import { registerReadyHook } from '../../src/hooks/ready';

describe('Ready Hook', () => {
  let logger: ILogger;

  beforeEach(() => {
    /*
     * Reset the mock between tests so each test starts with no previous
     * calls or configured return values.
     */
    mockValidate.mockReset();

    logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    /*
     * Provide the mimimum Foundry globals required by the ready hook.
     */
    vi.stubGlobal('game', {
      system: {
        id: 'test-system',
      },
    });

    /*
     * Execute the registered ready callback immediately so the test can
     * observe the hook's behaviour without waiting for Foundry.
     */
    vi.stubGlobal('Hooks', {
      once: vi.fn((_hook: string, callback: () => void) => {
        callback();
      }),
    });
  });

  it('should continue MAF initialisation when compatibility validation succeeds', () => {
    const result: CompatibilityResult = {
      status: 'compatible',
      message: 'Foundry VTT runtime is available.',
    };

    mockValidate.mockReturnValue(result);

    registerReadyHook(logger);

    expect(mockValidate).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(`${MODULE.NAME} module ready`);
  });

  it('should stop MAF initialisation when compatibility validation fails', () => {
    const result: CompatibilityResult = {
      status: 'incompatible',
      message: 'Test compatibility failure.',
    };

    mockValidate.mockReturnValue(result);

    registerReadyHook(logger);

    expect(mockValidate).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledWith(
      'Compatibility validation failed: Test compatibility failure.',
    );
    expect(logger.info).not.toHaveBeenCalledWith(`${MODULE.NAME} module ready`);
  });
});
