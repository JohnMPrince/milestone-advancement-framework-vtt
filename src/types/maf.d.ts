// src/types/maf.d.ts

import { MilestoneAdvancementService } from '../services/milestone-advancement-service';

declare global {
  interface Game {
    maf: {
      service: MilestoneAdvancementService;
    };
  }
}

export {};
