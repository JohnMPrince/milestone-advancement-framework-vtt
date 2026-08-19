# Development Notes

## 1. Project Architecture

The Milestone Advancement Framework VTT (MAF) is designed as a system-agnostic Foundry VTT module. The framework separates its core functionality from game-system-specific implementations through a System Adapter Architecture.

The project is organised around several key architectural layers:

- **Core Services** — Provide the framework's primary runtime functionality and coordinate MAF behaviour.
- **System Adapters** — Provide game-system-specific functionality while keeping system rules outside the core framework.
- **Applications** — Provide the user interface through Foundry VTT's Application framework.
- **Settings** — Provide centralised configuration and user preferences for the module.
- **Logging** — Provides a standardised logging mechanism for framework and service components.
- **Lifecycle Hooks** — Integrate the module with the Foundry VTT application lifecycle.

The architecture is intended to maintain a clear separation between framework infrastructure, user interface concerns and game-system-specific behaviour.

This separation allows additional game systems to be supported through new System Adapter implementations without requiring changes to the core MAF framework.

Detailed information about each architectural component is provided in the sections that follow.

## 2. Foundry VTT Lifecycle

MAF integrates with the Foundry VTT module lifecycle through the `init`, `setup` and `ready` hooks.

Lifecycle hooks are located in the `src/hooks/` directory and are registered through a central `src/hooks/index.ts` entry point.

### Hook Organisation

Each lifecycle hook is maintained in its own source file rather than placing all startup logic in the module entry point.

This provides a clear separation between lifecycle concerns and allows additional Foundry hooks to be introduced without making `main.ts` a central collection of unrelated logic.

The `src/hooks/index.ts` file is responsible for registering the available hooks.

### Init

The `init` hook is used for module configuration that must occur during Foundry's initialisation phase.

MAF uses this phase to:

- Register module settings.
- Register the MAF lifecycle hooks required during subsequent startup phases.

### Setup

The `setup` hook is responsible for initialising the MAF runtime once Foundry has completed its initial configuration.

During this phase, MAF:

- Creates the `ApplicationManager`.
- Creates the `MilestoneAdvancementService`.
- Injects the configured logger into these services.
- Initialises the `MilestoneAdvancementService`.
- Exposes the runtime services through the `game.maf` namespace.

The setup hook acts as the primary runtime composition point for the MAF framework. It creates the required services and establishes their relationships without placing their implementation logic directly inside the lifecycle hook.

### Ready

The `ready` hook is reserved for functionality that requires Foundry VTT to have completed its startup process.

MAF does not currently use the `ready` phase for core runtime composition. Functionality requiring the fully initialised Foundry environment may be added here as the framework develops.

### Lifecycle Design Principle

MAF keeps Foundry lifecycle hooks responsible for **integration and startup orchestration**, rather than placing business logic directly inside the hooks.

Lifecycle hooks create and initialise the appropriate MAF components, while the actual framework behaviour remains encapsulated within services and other dedicated components.

This separation keeps Foundry lifecycle integration lightweight and provides clear boundaries between Foundry startup concerns and MAF functionality.

## 3. Project Structure

The MAF project follows a structured source layout that separates game-system adapters, applications, core configuration, lifecycle integration, runtime services and supporting types.

The primary source structure is:

src/
├── adapters/
├── applications/
├── core/
├── hooks/
├── services/
├── types/
├── ui/
├── utils/
└── main.ts

### Adapters

The adapters/ directory contains game-system-specific implementations and the interfaces and management components required to support them.

This includes:

- System adapter interfaces.
- System adapter implementations.
- System adapter management.

Game-system-specific functionality should be implemented through adapters rather than directly within the MAF core framework.

### Applications

The `applications/` directory contains the MAF application framework and application management components.

Application code is responsible for presentation and user interaction and should remain separate from core framework and service logic.

### Core

The `core/` directory contains framework-level configuration and constants.

This includes module constants and settings registration.

### Hooks

The `hooks/` directory contains MAF's integration with the Foundry VTT lifecycle.

Lifecycle hooks are kept separate from the services and components they initialise or invoke.

### Services

The `services/` directory contains the core runtime services used by MAF.

Services encapsulate framework functionality and provide clear boundaries between lifecycle integration, application management and game-system-specific behaviour.

Examples include:

- Milestone advancement services.
- Compatibility validation.
- Logging.

### Types

The `types/` directory contains TypeScript type declarations and project-specific types used by MAF and its integration with Foundry VTT.

This includes declarations that extend or describe Foundry VTT and MAF-specific runtime objects.

### UI

The `ui/` directory contains user-interface-specific resources and components that are separate from the application framework itself.

### Utils

The `utils/` directory contains shared utility functionality that does not belong to a specific service, application or adapter.
Utilities should remain focused and should not become a general location for framework or business logic.

### Entry Point

The `main.ts` file provides the module entry point and is responsible for establishing the MAF module runtime and registering the required lifecycle integration.

### Supporting Project Directories

The project also contains supporting directories outside `src/`:

- `documentation/` — Project development and release documentation.
- `templates/` — Handlebars templates used by MAF applications.
- `public/` — Static resources used during development/build processing.
- `tests/` — Automated tests organised according to the components they verify.
- `.github/workflows/` — GitHub Actions workflow definitions.

The build process packages the required source and resource files into the structure expected by Foundry VTT.

### Structure Principles

The project structure is intended to maintain clear separation of concerns:

- `adapters` handle game-system-specific functionality.
- `applications` handle application behaviour and presentation.
- `core` handles framework configuration and constants.
- `hooks` handle Foundry VTT lifecycle integration.
- `services` handle runtime framework functionality.
- `types` provide compile-time type information.
- `ui` contains user-interface-specific components.
- `utils` contains reusable supporting functionality.

New functionality should be placed in the component that owns its responsibility rather than adding unrelated logic to lifecycle hooks, services or other existing components.

## 4. Core Service Architecture

MAF uses a service-based architecture to separate runtime functionality from Foundry VTT lifecycle integration, user interface components and game-system-specific implementations.

Services are located in the `src/services/` directory and encapsulate discrete areas of framework functionality.

### Service Responsibilities

The current service layer includes:

- `MilestoneAdvancementService` — Coordinates the initialisation of the milestone advancement framework and system adapter resolution.
- `MilestoneService` — Provides the service boundary for milestone-related application logic.
- `MilestoneRegistrationService` — Provides the capability to manage the registration and deregistration of milestones.
- `CompatibilityValidatorService` — Provides runtime compatibility validation.
- `Logger` — Provides the standardised logging implementation used throughout the framework.

Services are intended to own application and framework logic rather than placing this functionality directly within Foundry lifecycle hooks or application components.

### Service Interfaces

Where appropriate, services expose interfaces defining the contract that their implementation must provide.

Current service interfaces include:

- `IMilestoneService`
- `ICompatibilityValidator`
- `IMilestoneRegistrationService`
- `ILogger`

Interfaces allow consumers to depend on the required behaviour rather than a specific implementation.

The `IMilestoneService` interface currently defines the initial milestone service contract. Its implementation is intentionally minimal at this stage and will be expanded as milestone functionality is developed.

### Milestone Advancement Service

`MilestoneAdvancementService` currently acts as the primary coordinating service for the MAF runtime.

It is responsible for:

- Initialising the milestone advancement framework.
- Creating and maintaining the `MilestoneService`.
- Creating and managing the `SystemAdapterManager`.
- Registering available system adapters.
- Resolving the adapter corresponding to the active Foundry VTT game system.
- Providing access to the resolved system adapter.

The service maintains the currently resolved system adapter through the `systemAdapter` property.

System adapter registration and resolution are delegated to the `SystemAdapterManager`, maintaining a separation between service orchestration and adapter management.

### MilestoneService

The `MilestoneService` owns milestone-related behaviour and lifecycle management.

Responsibilities:

- Manage milestone lifecycle

The service handles milestone concepts and rules without requiring knowledge of the underlying game system implementation.

### Dependency Injection

MAF uses dependency injection where a service has an external dependency that should be supplied by its caller.

`MilestoneAdvancementService` receives an `ILogger` through its constructor:

```ts
constructor(private readonly logger: ILogger)
```

This allows the service to depend on the logging contract rather than directly creating a `Logger` instance.

The approach also allows a different implementation of `ILogger` to be supplied when required, including during automated testing.

Dependency injection is currently applied selectively. Services that do not yet require externally supplied dependencies may construct their own supporting components.

### Logging Service

The Logger class implements the ILogger interface and provides the standard logging interface used by MAF.

It supports:

- `info`
- `warn`
- `error`
- `debug`

Each logger instance is created with a scope, which is included in the formatted log message.

Debug logging is controlled through the module's debug setting. Debug messages are suppressed when debug mode is disabled.

### Compatibility Validation

CompatibilityValidatorService implements ICompatibilityValidator and provides runtime validation of the Foundry environment.

The validator currently checks that:

- The Foundry game runtime is available.
- An active Foundry game system is available.

The service returns a CompatibilityResult indicating whether the runtime is currently compatible with the expected MAF environment.

Further system-specific compatibility is handled through the System Adapter Architecture.

### Milestone Registration Service

MAF-2.2 introduced MilestoneRegistrationService and its interface, IMilestoneRegistrationService.

The service:

- registers valid `Milestone` domain objects;
- uses the milestone `key` as its stable registration identity;
- rejects duplicate keys deterministically;
- allows milestones with identical names when their keys differ;
- retrieves registered milestones by key;
- preserves the registered domain object and its metadata.

#### Domain Boundary

Validation of milestone invariants remains the responsibility of the `Milestone` domain model established in **MAF-2.1**. The registration service does not duplicate domain validation.

Creation and registration are separate operations. Constructing a `Milestone` does not register it; registration must be explicitly requested through `MilestoneRegistrationService`.

#### Awarding Boundary

Registration does not award a milestone or modify advancement state. The registration mechanism establishes the availability of milestone definitions for subsequent operations. The awarding lifecycle will be addressed by MAF-2.3.

### Service Design Principles

The service architecture follows these principles:

- Services encapsulate framework and application logic.
- Lifecycle hooks are responsible for startup orchestration rather than business logic.
- Services should depend on interfaces where an abstraction provides value.
- Dependencies may be supplied through constructor injection.
- System-specific behaviour belongs in System Adapters rather than core services.
- Services should maintain clear and focused responsibilities.
- Runtime functionality should be accessed through dedicated services rather than global configuration objects.

The service architecture will evolve as additional MAF functionality is implemented. New services should be introduced when functionality represents a distinct responsibility that would otherwise create unnecessary coupling within an existing service.

## 5. System Adapter Architecture

MAF is designed to be system-agnostic. Game-system-specific functionality is separated from the core framework through the System Adapter Architecture.

System adapters provide a defined interface between MAF and the data and functionality provided by a supported Foundry VTT game system.

### System Adapter Components

The System Adapter Architecture consists of three primary components:

- **System Adapter Interface** — Defines the contract that a supported game system must implement.
- **System Adapter Implementations** — Provide game-system-specific implementations of that contract.
- **System Adapter Manager** — Registers available adapters and resolves the appropriate adapter for the active game system.

These components are located in the `src/adapters/` directory.

### System Adapter Interface

The `ISystemAdapter` interface defines the functionality currently required by MAF from a supported game system.

The current contract provides methods for:

- Identifying the supported game system through `getSystemId()`.
- Retrieving the current party through `getParty()`.
- Retrieving a character's level through `getCharacterLevel()`.

The interface uses the `SupportedSystemId` type to ensure that adapters identify themselves using a recognised MAF system identifier.

Core MAF services should interact with supported systems through `ISystemAdapter` rather than directly depending on a specific system implementation.

### System Adapter Implementations

Each supported game system is implemented as a separate System Adapter.

The initial implementation is the D&D 5e adapter:

```text
src/adapters/systems/system-adapter-dnd5e.ts
```

## Dnd5eSystemAdapter

The `Dnd5eSystemAdapter` provides the D&D 5e-specific implementation of the system adapter contract.

Responsibilities:

- Translate D&D 5e structures into MAF-compatible data

The adapter isolates D&D 5e-specific knowledge from the core MAF framework, allowing additional game systems to be supported without modifying core services.

The D&D 5e adapter implements the `ISystemAdapter` contract and provides D&D 5e-specific access to actor data.

For example, `getCharacterLevel()` retrieves the character level from the D&D 5e actor data structure.

System-specific data structures should remain within the appropriate adapter rather than being exposed directly to core MAF services.

Some adapter functionality may initially be implemented as a placeholder while the corresponding MAF functionality is developed.

### System Adapter Manager

The `SystemAdapterManager` manages the collection of available System Adapter implementations.

Its responsibilities are:

- Registering System Adapters.
- Maintaining registered adapters.
- Resolving an adapter using a Foundry VTT system ID.

Adapters are stored using their system ID as the lookup key. This allows the active Foundry VTT system to be used to resolve the appropriate adapter at runtime.

If no adapter is registered for a requested system ID, `resolveAdapter()` returns `null`.

### Adapter Registration and Resolution

During runtime initialisation, `MilestoneAdvancementService` creates a `SystemAdapterManager` and registers the System Adapters supported by the current MAF implementation.

The initial implementation registers the D&D 5e adapter.

MAF then uses the active Foundry VTT system ID to request the corresponding adapter from the `SystemAdapterManager`.

The resolved adapter is retained by `MilestoneAdvancementService` and exposed through its `systemAdapter` property.

If no adapter is available for the active system, no adapter is resolved and the service logs a warning.

### System Agnostic Design Principle

The System Adapter Architecture establishes a boundary between the MAF framework and individual game systems.

The core framework should:

- Interact with supported systems through `ISystemAdapter`.
- Avoid directly accessing system-specific data structures where an adapter can provide the required abstraction.
- Delegate system-specific data access and behaviour to the appropriate adapter.

System adapters should:

- Implement the `ISystemAdapter` contract.
- Contain system-specific data access and behaviour.
- Prevent system-specific data structures from leaking into core MAF services.

Additional game systems can be supported by implementing the `ISystemAdapter` contract and registering the resulting adapter with the `SystemAdapterManager`.

The adapter contract is expected to evolve as additional system-independent MAF functionality is developed.

Architectural Decision: System adapters are registered and resolved by SystemAdapterManager. Core MAF services must not directly depend on game-system implementations.

## 6. Settings Framework

MAF uses a centralised settings framework to manage module configuration and user preferences.

Settings are defined and registered separately from the services and applications that consume them. This provides a consistent approach to configuration and prevents individual components from independently defining or registering module settings.

### Module Constants

The module identity is defined centrally through the `MODULE` constant:

```ts
export const MODULE = {
  LOG_PREFIX: 'MAF',
  ID: 'milestone-advancement-framework',
  NAME: 'Milestone Advancement Framework',
} as const;
```

The log prefix, module ID and name should be referenced through `LOG_PREFIX`, `MODULE.ID` and `MODULE.NAME` rather than duplicated throughout the codebase.

### Settings Constants

Setting identifiers are maintained as constants within the core configuration structure.

The `SETTINGS` constant provides a single source of truth for setting keys used throughout the module.

This prevents setting identifiers from being duplicated as string literals across the codebase.

### Settings Registration

Module settings are registered during the Foundry VTT `init` lifecycle phase.

Settings registration is handled by the module settings registration function rather than being performed directly by individual services or applications.

This ensures that all MAF settings are available before components that depend on them begin normal runtime operation.

### Accessing Settings

MAF components access registered settings through Foundry VTT's settings API.

The module ID and centralised setting constants should be used when retrieving settings:

```ts
game.settings.get(MODULE.ID, SETTINGS.<SETTING_KEY>)
```

This provides a consistent access pattern and avoids hard-coded module IDs or setting keys throughout the application.

### Current Settings

The current settings framework includes configuration for MAF debug logging.

The debug setting controls whether debug-level messages are emitted by the MAF logging framework.

Additional settings can be added to the centralised settings definition as the framework develops.

### Settings Design Principles

The settings framework follows these principles:

- Setting keys are defined centrally.
- Settings are registered during the Foundry init lifecycle phase.
- Individual services and applications should not register their own settings.
- Components should access settings through the Foundry VTT settings API.
- Module identifiers and setting keys should use the centralised constants.
- Settings should represent user or module configuration rather than runtime application state.

Runtime state should remain within the appropriate MAF service or application rather than being stored as Foundry module settings.

## 7. Logging Framework

MAF provides a centralised logging framework to provide a consistent approach to diagnostic and runtime logging throughout the module.

The logging framework separates the logging contract from its implementation through the `ILogger` interface.

### Logger Interface

The `ILogger` interface defines the standard logging operations available to MAF components:

- `info()` — Informational messages about normal module operation.
- `warn()` — Warnings about conditions that do not prevent the module from continuing.
- `error()` — Errors encountered during module operation.
- `debug()` — Detailed diagnostic information used during development and troubleshooting.

MAF components should depend on `ILogger` rather than directly calling the underlying console logging methods.

### Logger Implementation

The `Logger` class implements `ILogger` and provides the current logging implementation.

Each logger instance is created with a scope. The scope is included in the resulting log message to identify the component generating the message.

For example:

```text
MAF | Initialising Milestone Advancement Service
```

### Logger Injection

MAF uses dependency injection to provide logging to services that require it.

For example, `MilestoneAdvancementService` receives an `ILogger` through its constructor:

```
constructor(private readonly logger: ILogger)
```

This means the service depends on the logging contract rather than directly constructing a `Logger`.

This provides:

- Separation between the service and logging implementation.
- Consistent logging behaviour.
- The ability to provide alternative logger implementations.
- Improved testability through mock logger implementations.

### Debug Logging

Debug logging is controlled through the MAF debug module setting.

When debug mode is disabled, calls to `logger.debug()` do not produce console output.

This allows detailed diagnostic logging to remain in the codebase without generating unnecessary console output during normal operation.

### Logging Conventions

MAF components should use the injected logger when logging runtime behaviour rather than directly using `console.log`, `console.info`, `console.warn` or `console.error`.

Logging should provide useful context about significant operations, failures and diagnostic information.

The appropriate logging level should be selected according to the purpose of the message:

- Use info for significant normal runtime events.
- Use warn when an unexpected or unsupported condition has been detected but execution can continue.
- Use error when an operation has failed.
- Use debug for detailed diagnostic information that is primarily useful during development.

The logging framework is intended to provide a consistent logging boundary throughout MAF and can be extended with additional implementations or behaviour as the framework develops.

## 8. Application Framework

MAF uses Foundry VTT's Application V2 framework to provide its user interface.

The Application Framework separates application lifecycle and management concerns from the core MAF services that provide framework functionality.

### Application Manager

The `ApplicationManager` is responsible for managing MAF applications at runtime.

It is created during the Foundry VTT `setup` lifecycle phase and exposed through the MAF runtime namespace.

The Application Manager provides a central location for application-related functionality and prevents lifecycle hooks from directly managing individual application instances.

### Application V2

MAF applications are implemented using Foundry VTT's Application V2 framework.

Application V2 provides the underlying Foundry VTT framework for:

- Application lifecycle management.
- Window management.
- Rendering.
- User interaction.

MAF application code should use the Application V2 APIs rather than relying on deprecated application framework implementations.

### Separation of Responsibilities

The Application Framework is responsible for presentation and user interaction.

Core services remain responsible for framework and domain logic, while applications remain responsible for presentation and user interaction.

The intended relationship is:

```text
Application
     │
     ▼
MAF Services
     │
     ▼
System Adapter
     │
     ▼
Foundry Game System
```

Applications should not directly implement game-system-specific rules or data access when that functionality belongs within a System Adapter.

### Application Initialisation

The `ApplicationManager` is instantiated during the MAF runtime initialisation performed by the `setup` hook.

The resulting manager is made available through the MAF runtime namespace:

game.maf.applications

This allows application functionality to be accessed through the central MAF runtime rather than requiring individual applications to be created directly by lifecycle hooks.

### Application Availability

MAF applications should only be made available when the required framework and system conditions have been satisfied.

System compatibility is therefore considered separately from the application presentation layer.

An unsupported game system should not cause a MAF application to be opened or presented to the user.

### Current Application

The initial MAF application provides the first user interface for the framework and can currently be accessed through a macro.

The initial implementation establishes the application architecture rather than representing the final milestone advancement user experience.

Further application functionality will be developed as the MAF feature set expands.

### Application Design Principles

The Application Framework follows these principles:

- Use Foundry VTT Application V2 for MAF applications.
- Keep application presentation separate from core services.
- Keep system-specific behaviour within System Adapters.
- Manage applications through `ApplicationManager`.
- Avoid placing application lifecycle management directly in Foundry lifecycle hooks.
- Prevent unsupported systems from presenting MAF functionality to users.

## 9. System Compatibility

MAF performs compatibility checks to determine whether the framework can operate within the current Foundry VTT runtime.

Compatibility validation is separated from system-specific functionality so that the core framework can determine whether the required Foundry environment is available before attempting to provide MAF functionality.

### Compatibility Validator

The `CompatibilityValidatorService` implements the `ICompatibilityValidator` interface and provides the central compatibility validation mechanism.

The validator currently checks that:

- The Foundry VTT `game` runtime is available.
- An active Foundry VTT game system is available.

The result is returned as a `CompatibilityResult`, which indicates whether the runtime is currently compatible.

### Runtime Compatibility vs System Support

MAF distinguishes between **runtime compatibility** and **system support**.

Runtime compatibility determines whether the Foundry environment required by MAF is available.

System support determines whether MAF has a System Adapter implementation for the active game system.

These responsibilities are handled separately:

```text
Foundry Runtime
      │
      ▼
Compatibility Validator
      │
      ├── Runtime compatible
      │
      ▼
Active Game System
      │
      ▼
System Adapter Manager
      │
      ├── Adapter available
      │
      └── No adapter available
```

A compatible Foundry runtime does not necessarily mean that the active game system is supported by MAF.

### System Adapter Resolution

During runtime initialisation, `MilestoneAdvancementService` attempts to resolve a System Adapter for the active Foundry game system.

The resolved adapter is stored in the service's `systemAdapter` property.

If no adapter is available, the property remains `null`.

The availability of this resolved adapter provides the application layer with the indication that MAF can operate with the current game system.

### Unsupported Systems

The `ApplicationManager` checks whether `MilestoneAdvancementService.systemAdapter` has been successfully resolved before opening the main MAF application.

If an adapter is available, the application is rendered.

If no adapter is available, the application is not rendered and a debug message is recorded indicating that the UI will not be displayed because the current system is unsupported.

This prevents users from being presented with MAF functionality that cannot operate correctly with their current game system.

### Compatibility Result

Compatibility checks use the `CompatibilityResult` type to provide both a status and an explanatory message.

This allows compatibility failures to provide meaningful diagnostic information rather than relying solely on a boolean result.

### Compatibility Design Principles

The compatibility architecture follows these principles:

- Runtime compatibility is validated independently of system-specific functionality.
- System support is determined through the System Adapter Architecture.
- System Adapter resolution determines whether system-specific MAF functionality can be provided.
- Unsupported systems should fail gracefully.
- Applications should not render when no appropriate System Adapter has been resolved.
- Compatibility failures should provide useful diagnostic information.
- Compatibility validation remains within the service layer rather than being implemented directly within application components.

## 10. Build and Packaging

MAF uses Vite as its build and packaging tool. The build process compiles the TypeScript source code and packages the module resources into an output structure suitable for installation and execution by Foundry VTT.

### Module Manifest

The MAF module manifest defines the metadata and resources required by Foundry VTT to recognise and load the module.

The manifest is maintained as part of the project source and is included in the generated module package.

Changes to module metadata, compatibility information or packaged resources should be made through the project configuration rather than by manually editing generated build output.

### Vite

Vite provides the project's build pipeline and is responsible for:

- Processing the TypeScript source code.
- Bundling the module JavaScript.
- Processing configured project resources.
- Producing the packaged module output.

The Vite configuration is maintained in the project root and defines the source entry point and build output used by the module.

### Source and Build Output

Source code is maintained within the project source structure and should not be edited directly in the generated build output.

The build process produces the distributable module in the `dist/` directory.

The generated output contains the files required by Foundry VTT to load and execute the module.

The `dist/` directory should therefore be treated as build output rather than the primary development location.

### Module Packaging

The build process packages the MAF module into the structure expected by Foundry VTT.

This includes the compiled JavaScript and required module resources such as:

- Module manifest.
- Templates.
- Styles.
- Localisation resources.
- Icons and other static assets.

The resulting package can be installed or linked into a Foundry VTT installation for testing.

### Development Environment

MAF targets Foundry VTT v14.

The project is written in TypeScript and uses the Foundry VTT type definitions through the `fvtt-types` path alias to provide compile-time type information for Foundry APIs.

The TypeScript version is maintained according to the compatibility requirements of the installed Foundry VTT type definitions.

The Foundry type definitions are referenced from the project's declaration file:

```ts
import 'fvtt-types';
```

This makes Foundry globals such as `Hooks` available to TypeScript without requiring runtime imports.

### Development Workflow

The expected development workflow is:

1. Make changes within the project source files.
2. Run the project validation and formatting checks.
3. Run the Vite build.
4. Verify the generated module output.
5. Test the resulting module within Foundry VTT.

The generated build should not be manually modified. Changes should be made to the source files and regenerated through the build process.

### Build Validation

The build process forms part of the project's automated validation.

A successful build confirms that the TypeScript source and configured module resources can be processed into a valid module package.

Build validation is also performed by the project's Continuous Integration pipeline.

### Build Design Principles

The build and packaging process follows these principles:

- Source files remain the authoritative development files.
- Vite is responsible for compilation and packaging.
- Generated files are treated as build output.
- The resulting package must conform to Foundry VTT's module structure.
- Build failures should prevent invalid module output from being treated as a successful build.
- The same build process should be reproducible locally and within Continuous Integration.

## 11. Code Quality

The project uses ESLint and Prettier to maintain consistent, high-quality TypeScript code.

### Prettier

Prettier is used to provide consistent source-code formatting throughout the project.

Formatting rules are maintained in the project's `.prettierrc` configuration.

Files that should not be formatted by Prettier are excluded through `.prettierignore`.

Developers should allow Prettier to format source files rather than manually maintaining formatting conventions.

Check whether files are correctly formatted with:

```bash
npm run format:check
```

Automatically format the project with:

```bash
npm run format:write
```

### ESLint

ESLint is used to identify potential problems and enforce coding standards within the project.

The project uses the TypeScript ESLint integration to allow ESLint to analyse TypeScript source files.

ESLint configuration is maintained in the project's `eslint.config.js` file.

Run the linter with:

```bash
npm run lint
```

ESLint can automatically fix supported issues with:

```bash
npm run lint:fix
```

### TypeScript ESLint

TypeScript ESLint extends ESLint to provide rules and analysis appropriate for TypeScript code.

This allows the project's linting process to identify issues that would not be covered by standard JavaScript linting alone.

### Package Scripts

Code quality operations are exposed through the project's npm scripts.

The quality checks can therefore be run consistently by developers and by the Continuous Integration pipeline.

The project's validation process includes formatting verification and linting alongside the TypeScript/build process.

### Development Workflow

Code quality checks should be performed before changes are committed.

The expected workflow is:

1. Implement the required change.
2. Run the project's formatting and linting checks.
3. Resolve any reported issues.
4. Run the build and other applicable tests.
5. Commit the completed change.

See below for specific commands prior to step 5:

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

### Tooling Configuration

The project's code-quality configuration is maintained in the following files:

- `eslint.config.js` — ESLint configuration and TypeScript linting rules.
- `.prettierrc` — Prettier formatting conventions.
- `.prettierignore` — Files and directories excluded from Prettier.
- `package.json` — Development tooling commands.

Generated build output and dependencies are excluded from code-quality formatting and analysis where appropriate.

### Code Quality Principles

The project follows these principles:

- Source code should conform to the configured ESLint rules.
- TypeScript code should be analysed using TypeScript-aware linting.
- Source formatting should be handled by Prettier.
- Developers should not bypass automated quality checks to merge incomplete or invalid code.
- Code quality checks should be reproducible locally and within Continuous Integration.

## 12. Continuous Integration

MAF uses GitHub Actions to automatically validate changes made to the project.

The Continuous Integration (CI) pipeline provides an automated quality gate that verifies changes before they can be merged into the `main` branch.

### CI Pipeline

The CI workflow is defined within:

```text
.github/workflows/
```

The pipeline performs the project's required validation checks, including:

- Source formatting verification.
- Code quality and linting checks.
- TypeScript validation.
- Module build and packaging.

The CI pipeline must complete successfully before a change can be merged into the protected `main` branch.

### Pull Request Validation

Changes intended for the `main` branch are validated through the CI pipeline before merging.

This ensures that changes introduced through a pull request have passed the project's automated quality and build checks.

A failed CI run prevents the change from satisfying the project's merge requirements.

### Main Branch Protection

The `main` branch is protected through GitHub repository rules.

The branch requires the MAF CI build check to pass before changes can be merged.

The branch protection configuration also prevents:

- Force pushes to `main`.
- Unrestricted deletion of `main`.

These protections help preserve the integrity of the main development branch.

### Local and CI Validation

The same core validation operations should be executable locally before submitting a change.

Developers should therefore use the project's npm scripts to identify formatting, linting, type or build issues before creating a pull request.

CI provides the final automated verification rather than replacing local development validation.

### Continuous Integration Principles

The CI process follows these principles:

- All changes entering `main` must pass automated validation.
- CI should verify the same core quality requirements expected during local development.
- Failed validation should prevent a change from being merged.
- The `main` branch should remain protected from force pushes and accidental deletion.
- Build and quality failures should be resolved before merging.

## 13. Development Conventions

MAF development follows a set of conventions intended to maintain separation of concerns, consistency and a clear architectural boundary between the framework and supported game systems.

### Separation of Concerns

Components should have a clear and focused responsibility.

The established architectural boundaries are:

- **Lifecycle Hooks** — Integrate MAF with Foundry VTT lifecycle events and orchestrate startup.
- **Services** — Contain framework and application logic.
- **Applications** — Manage presentation and user interaction.
- **System Adapters** — Provide game-system-specific functionality and data access.
- **Core** — Provides framework configuration and constants.
- **Utilities** — Provide reusable supporting functionality.
- **Types** — Provide compile-time type information.

Functionality should be implemented in the component responsible for that concern rather than introducing unrelated logic into another component.

### System Agnostic Core

The MAF core should remain independent of individual game systems.

Game-system-specific functionality should be implemented through the System Adapter Architecture.

Core services should interact with game systems through adapter interfaces rather than directly accessing system-specific data structures where an appropriate adapter abstraction exists.

### Dependency Injection

Dependencies that represent external services or replaceable implementations should be supplied through dependency injection where appropriate.

Interfaces should be used when they provide a meaningful abstraction between a component and its implementation.

Dependency injection is currently applied selectively rather than being required for every service or component.

### Lifecycle Integration

Foundry VTT lifecycle hooks should remain focused on integration and orchestration.

Business logic should not be placed directly within lifecycle callbacks when it can be encapsulated within a service or other dedicated component.

### Centralised Configuration

Module constants and settings should be defined centrally and reused throughout the project.

Hard-coded module IDs, setting keys and other configuration values should be avoided where a project constant exists.

Runtime state should be maintained by the appropriate service or application rather than being stored in module settings or global configuration objects.

### Logging

MAF components should use the `ILogger` abstraction for runtime logging rather than directly calling console logging methods.

The appropriate logging level should be selected based on the purpose of the message.

### TypeScript

New source code should be written in TypeScript and should make use of the project's type definitions.

Type safety should be maintained wherever practical, and `unknown` should be preferred over `any` when the type of a value is not known.

### Code Quality

Changes should conform to the project's ESLint and Prettier configuration.

Developers should run the relevant formatting, linting, type-checking and build validation before committing changes.

### Test-Driven Development

MAF-2.2 marked the transition to a more deliberate **Test-Driven Development (TDD)** workflow for new feature implementation.

The implementation process was refined to:

1. Review the acceptance criteria.
2. Define test contracts for meaningful observable behaviours.
3. Write the test before implementing the required behaviour where appropriate.
4. Implement the minimum behaviour required to satisfy the contract.
5. Reassess the acceptance criteria and test strategy during implementation.

This process demonstrated that acceptance criteria do not necessarily map one-to-one to automated tests. Architectural constraints and design boundaries may be more appropriately verified through implementation review and documented architectural decisions. This principle is captured separately in the Test Architecture as **TAS-001**.

### Testing Approach

MAF tests should verify observable component behaviour rather than implementation details.

Tests should include both positive and negative scenarios where appropriate.

Negative tests are particularly important for framework boundaries, such as confirming that unsupported systems do not cause MAF applications to open.

Dependencies represented by interfaces may be replaced with test doubles or mocks to isolate the component under test.

Testing should support the architectural boundaries established by MAF, including service dependencies, system adapter resolution and application management.

### Testing

New functionality should include appropriate automated tests where practical.

Tests should verify both expected behaviour and relevant negative or failure conditions.

Architectural changes should be tested in a way that confirms the intended component boundaries and dependency relationships.

### Documentation

Significant architectural decisions and development conventions should be documented alongside the project rather than relying solely on development history.

Documentation should describe the current implementation and established design decisions. Temporary debugging information and implementation troubleshooting should not normally be retained as permanent project documentation.
