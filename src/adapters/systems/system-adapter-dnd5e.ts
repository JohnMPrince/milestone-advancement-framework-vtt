// src/adapters/systems/system-adapter-dnd5e.ts

import { SUPPORTED_SYSTEMS, SupportedSystemId } from '../../core/constants/systems';
import { ISystemAdapter } from '../system-adapter-interface';

interface Dnd5eActorSystem {
  details?: {
    level?: number;
  };
}

export class Dnd5eSystemAdapter implements ISystemAdapter {
  getSystemId(): SupportedSystemId {
    return SUPPORTED_SYSTEMS.DND5E;
  }

  public getParty(): unknown {
    return [];
  }

  getCharacterLevel(actor: Actor): number {
    const system = actor.system as Dnd5eActorSystem;
    return system.details?.level ?? 0;
  }
}
