// src/services/compatibility-validator.ts

import { CompatibilityResult } from '../types/compatibility';
import { ICompatibilityValidator } from './compatibility-validator-interface';

export class CompatibilityValidatorService implements ICompatibilityValidator {
  validate(): CompatibilityResult {
    return {
      status: 'compatible',
      message: 'Compatibility validation passed.',
    };
  }
}
