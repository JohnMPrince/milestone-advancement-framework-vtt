// src/types/maf.d.ts

import { MAFService } from '../services/maf-service';

declare global {
  interface Game {
    maf: MAFService;
  }
}
