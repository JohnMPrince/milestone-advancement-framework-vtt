// src/services/maf-service.ts

import { MilestoneService } from './milestone-service';

export class MAFService {
  public readonly milestone: MilestoneService;

  constructor() {
    this.milestone = new MilestoneService();
  }

  public initialise(): void {
    // Service initialisation will be added as required.
  }
}
