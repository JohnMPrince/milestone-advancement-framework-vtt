// src/applications/base/maf-application.ts

import { MODULE } from '../../core/constants/core';
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MAFApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'maf-application',
    classes: ['maf'],
    window: {
      title: `${MODULE.NAME}`,
      icon: 'fas fa-award',
    },
    position: {
      width: 500,
      height: 400,
    },
  };

  static PARTS = {
    content: {
      template: `modules/${MODULE.ID}/templates/application.hbs`,
    },
  };
}
