// src/services/compatibility-validator-interface.ts
import { CompatibilityResult } from '../types/compatibility';

export interface ICompatibilityValidator {
  validate(): CompatibilityResult;
}
