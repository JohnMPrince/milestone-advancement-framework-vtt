// src/adapters/system-adapter-interface.ts

import type { SupportedSystemId } from '../core/constants/systems';

/**
 * A contract for systems to meet in order to be used
 */
export interface ISystemAdapter {
  getSystemId(): SupportedSystemId;
  getParty(): unknown;
  getCharacterLevel(actor: Actor): number;
}
