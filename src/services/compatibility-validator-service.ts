// src/services/compatibility-validator.ts

import { CompatibilityResult } from '../types/compatibility';
import { ICompatibilityValidator } from './compatibility-validator-interface';

export class CompatibilityValidatorService implements ICompatibilityValidator {
  validate(): CompatibilityResult {
    return this.validateRuntime();
  }

  private validateRuntime(): CompatibilityResult {
    if (typeof game === 'undefined' || !game) {
      return {
        status: 'incompatible',
        message: 'Foundry VTT runtime is unavailable.',
      };
    }

    if (!game.system) {
      return {
        status: 'incompatible',
        message: 'Foundry VTT game system is unavailable.',
      };
    }

    return {
      status: 'compatible',
      message: 'Foundry VTT runtime is available.',
    };
  }
}
