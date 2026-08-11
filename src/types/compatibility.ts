// src/types/compatibility.ts

export type CompatibilityStatus = 'compatible' | 'warning' | 'incompatible';

export interface CompatibilityResult {
  status: CompatibilityStatus;
  message: string;
}


