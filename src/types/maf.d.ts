// src/types/maf.d.ts

import { ApplicationManager } from '../applications';
import { MilestoneAdvancementService } from '../services/milestone-advancement-service';

declare global {
  interface Game {
    maf: {
      applications: ApplicationManager;
      service: MilestoneAdvancementService;
    };
  }
}

export {};
