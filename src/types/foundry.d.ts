// src/types/foundry.d.ts

/// <reference types="fvtt-types" />

declare global {
  namespace ClientSettings {
    interface Namespace {
      'milestone-advancement-framework': never;
    }
  }
}

export {};
