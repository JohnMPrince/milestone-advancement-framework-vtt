# Milestone Advancement Framework for Foundry VTT

A Foundry VTT version 14 compatible project built to provide milestone advancement framework for supported systems on Foundry VTT.

## Version 0.0.1

Initial build of the Module which established the module infrastructure in Foundry VTT.

## Version 0.0.2

Established Development tools and configured Vite Builds and module packaging. As part of this version, a GitHub Build Pipeline was built and verified.

## Version 0.0.3

Implemented the Foundry Module Lifecycle hooks to respond to init, setup and ready events.

## Version 0.0.4

Established the Core Service Architecture of the module and System Adapter Architecture for supporting game systems. Also implemented a Game Setting dialog for the module.

## Version 0.0.5

Implementation of a logging framework that uses dependency injection. This will allow logging throughout the module through a standard approach.

## Version 0.0.6 (Current)

Created the initial user interface for the Application which is available via macro call.

### Foundry VTT Types

The project targets Foundry VTT v14.

At present, the latest available `@league-of-foundry-developers/foundry-vtt-types`
package is version 13.x. This package is used for TypeScript development until
a v14-compatible typings release is available.

The dependency is pinned to a specific version in `package.json` to ensure
reproducible builds.

## Code Quality & Development Tooling

The project uses ESLint and Prettier to maintain consistent, high-quality TypeScript code.

### ESLint

[ESLint](https://eslint.org/) is used to identify potential code-quality issues in the TypeScript source code.

Run the linter with:

```bash
npm run lint
```

ESLint can automatically fix supported issues with:

```bash
npm run lint:fix
```

### Prettier

[Prettier](https://prettier.io/) is used to enforce consistent code formatting.

Check whether files are correctly formatted with:

```bash
npm run format:check
```

Automatically format the project with:

```bash
npm run format
```

### Recommended Development Workflow

Before committing changes, run:

```bash
npm run lint
npm run format:check
npm run build
```

If formatting issues are reported, they can generally be resolved with:

```bash
npm run format
```

If ESLint reports automatically fixable issues, use:

```bash
npm run lint:fix
```

### Tooling Configuration

The project's code-quality configuration is maintained in the following files:

- `eslint.config.js` — ESLint configuration and TypeScript linting rules.
- `.prettierrc` — Prettier formatting conventions.
- `.prettierignore` — Files and directories excluded from Prettier.
- `package.json` — Development tooling commands.

Generated build output and dependencies are excluded from code-quality formatting and analysis where appropriate.

## Development and Quality Checks

The project uses automated tooling to maintain code quality and ensure that the module can be built successfully.

### Local Checks

The following npm scripts can be run locally before committing changes:

| Command                | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `npm run lint`         | Runs ESLint against the project                                   |
| `npm run format`       | Formats the project using Prettier                                |
| `npm run format:check` | Checks that files conform to the project's Prettier configuration |
| `npm run typecheck`    | Performs TypeScript type checking without generating output       |
| `npm run build`        | Builds the module using Vite                                      |

It is recommended to run the quality checks before creating a pull request.

### Continuous Integration

The project uses GitHub Actions for continuous integration.

CI runs automatically when:

- Changes are pushed to `main`.
- A pull request is opened or updated against `main`.

The CI pipeline performs the following checks:

1. Installs dependencies using `npm ci`.
2. Runs ESLint.
3. Checks code formatting with Prettier.
4. Performs TypeScript type checking.
5. Builds the module using Vite.
6. Verifies that the expected build output is generated.

A pull request must pass the required CI checks before it can be merged.

### Build Output

The Vite build generates the module's compiled output in the `dist` directory.

The `dist` directory is the build output consumed by the Foundry VTT module. Source files and development tooling remain outside the distribution output.

### Automated Testing

Automated tests are not currently part of the CI pipeline.

A dedicated testing framework and test suite will be introduced in a future milestone. Once established, automated tests will be added to the CI pipeline alongside the existing linting, formatting, type-checking, and build validation.

## Module Lifecycle

The Milestone Advancement Framework uses Foundry VTT's module lifecycle hooks to initialise and prepare the module during startup.

Lifecycle hooks are located in the `src/hooks/` directory and are registered through a central `src/hooks/index.ts` entry point.

### Lifecycle Flow

The module entry point loads the lifecycle hook registration:

```text
src/main.ts
    │
    ▼
src/hooks/index.ts
    │
    ├── init.ts
    │
    └── ready.ts
```

### `init`

The `init` hook runs during Foundry VTT's initialisation phase.

MAF uses this phase for early module setup, including functionality that needs to be registered before the remainder of Foundry has finished loading.

```ts
Hooks.once('init', () => {
  // Module initialisation
});
```

### `ready`

The `ready` hook runs once Foundry VTT has completed its startup process and the game environment is available.

MAF uses this phase for functionality that depends on Foundry's fully initialised game environment.

```ts
Hooks.once('ready', () => {
  // Module ready processing
});
```

### Hook Organisation

Each lifecycle hook is maintained in its own source file rather than placing all startup logic in the module entry point.

This provides a clear separation between lifecycle concerns and allows additional Foundry hooks to be introduced without making `main.ts` a central collection of unrelated logic.

The `src/hooks/index.ts` file is responsible for registering the available hooks.

### Foundry Type Definitions

MAF is written in TypeScript and uses the Foundry VTT type definitions through the `fvtt-types` path alias.

The Foundry type definitions are referenced from the project's declaration file:

```ts
import 'fvtt-types';
```

This makes Foundry globals such as `Hooks` available to TypeScript without requiring runtime imports.

### Module Constants

The module identity is defined centrally through the `MODULE` constant:

```ts
export const MODULE = {
  ID: 'milestone-advancement-framework',
  NAME: 'Milestone Advancement Framework',
} as const;
```

The module ID and name should be referenced through `MODULE.ID` and `MODULE.NAME` rather than duplicated throughout the codebase.

### Addendum

### Component: System Adapter

The System Adapter provides as system-agnostic interface between the Milestone Advancement Framework and the active Foundry game system.

## Core Responsibilities

- Identifying whether the active system is supported.
- Accessing system-specific actor/party data.
- Reading the information MAF needs.
- Writing MAF-related data where appropriate.
- Translating system-specific structures into MAF's common model.

## MAF Data Model

MAF
│
├── Party
│ ├── Members
│ └── Milestones
│
└── Character
└── Level

## Introducing the System Adapter Manager

Foundry game.system.id
│
├── Adapter Manager
│ ├── dnd5e system adapter
│ ├── pf2e system adapter

# MAF Service Responsibility Overview

The Milestone Advancement Framework separates responsibilities across services and adapters to maintain a system-agnostic architecture.

## MilestoneAdvancementService

The `MilestoneAdvancementService` acts as the application-level orchestration layer for MAF.

Responsibilities:

- ✅ Create MAF services
- ✅ Register MAF components
- ✅ Coordinate startup and service initialisation

The service is responsible for composing the MAF runtime environment but does not contain system-specific or milestone-specific logic.

---

## SystemAdapterManager

The `SystemAdapterManager` manages the available system integrations.

Responsibilities:

- ✅ Store registered system adapters
- ✅ Resolve the appropriate adapter for the active game system

The manager provides the bridge between the MAF framework and supported game systems while keeping system selection logic isolated.

---

## MilestoneService

The `MilestoneService` owns milestone-related behaviour and lifecycle management.

Responsibilities:

- ✅ Manage milestone lifecycle

The service handles milestone concepts and rules without requiring knowledge of the underlying game system implementation.

---

## Dnd5eSystemAdapter

The `Dnd5eSystemAdapter` provides the D&D 5e-specific implementation of the system adapter contract.

Responsibilities:

- ✅ Translate D&D 5e structures into MAF-compatible data

The adapter isolates D&D 5e-specific knowledge from the core MAF framework, allowing additional game systems to be supported without modifying core services.

# System Adapter Architecture Decision

## Overview

MAF uses a system adapter architecture to maintain a system-agnostic core framework.

System-specific implementations are isolated behind the `ISystemAdapter` contract and managed through the `SystemAdapterManager`.

## Architectural Principle

> System adapters are registered and resolved by `SystemAdapterManager`. Core MAF services consume MAF concepts and do not directly depend on game-system implementations.

## Responsibilities

### SystemAdapterManager

The `SystemAdapterManager` is responsible for:

- Registering available system adapters.
- Resolving the appropriate adapter for the active Foundry system.
- Providing a consistent access point between MAF and system-specific implementations.

### System Adapters

System adapters provide the translation layer between Foundry game systems and MAF.

Responsibilities include:

- Understanding system-specific data structures.
- Translating system data into MAF-compatible concepts.
- Hiding implementation details from the core framework.

### Core MAF Services

Core services such as `MilestoneService` operate on MAF concepts and lifecycle management.

They should:

- Remain system agnostic.
- Avoid direct references to Foundry system implementations.
- Interact with system-specific behaviour only through adapter contracts.

This separation allows MAF to support additional game systems without modifying core framework logic.

## Benefits

This architecture provides:

- **Extensibility** — New systems can be added by implementing `ISystemAdapter`.
- **Maintainability** — System-specific changes are isolated from core functionality.
- **Testability** — Core services can be tested independently from specific game systems.
- **Stability** — Changes to one system adapter do not affect unrelated systems.
