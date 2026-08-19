# Project Architecture

This document describes the architecture and decisions made via the process of designing the Milestone Advancement Framework (MAF).

This will be broken down by subject area to make it easier to identify specific decisions.

## Domain Model

The MAF domain model provides the system-agnostic concepts used to represent campaign milestones and milestone awards.

### Domain Model Structure

The current domain model consists of:

| Concept          | Responsibility                                     |
| ---------------- | -------------------------------------------------- |
| `Milestone`      | Defines a reusable campaign progression award      |
| `MilestoneAward` | Records an occurrence of a milestone being awarded |
| `MAFIdentity`    | Represents an identity within the MAF domain       |
| `MilestoneType`  | Categorises a milestone                            |

### Key Decisions

The following is a list of the key decisions made surrounding the design of the Domain Model:

| Identifier | Statement                                                 | Status   |
| ---------- | --------------------------------------------------------- | -------- |
| DM-001     | A milestone represents campaign progression               | Accepted |
| DM-002     | Milestone and MilestoneAward are distinct concepts        | Accepted |
| DM-003     | Milestone identity uses a human-readable `key`            | Accepted |
| DM-004     | Milestone `name` is separate from its identity            | Accepted |
| DM-005     | Core Milestone data defined                               | Accepted |
| DM-006     | Milestone categorisation uses an optional `MilestoneType` | Accepted |
| DM-007     | Milestone creation provenance uses `MAFIdentity`          | Accepted |
| DM-008     | MilestoneAward references a Milestone by `milestoneKey`   | Accepted |
| DM-009     | MilestoneAward records awarding provenance                | Accepted |
| DM-010     | MilestoneAward reason is optional                         | Accepted |
| DM-011     | Domain metadata is extensible and opaque                  | Accepted |
| DM-012     | The domain model contains no advancement logic            | Accepted |
| DM-013     | The domain model is system and Foundry agnostic           | Accepted |
| DM-014     | Domain invariants are enforced by domain objects          | Accepted |

### DM-001 A milestone represents campaign progression

A `Milestone` represents an **award/prize representing meaningful campaign progression**.

It is not:

- an objective
- a task
- an advancement requirement
- progression state

### DM-002 Milestone and MilestoneAward are distinct concepts

We explicitly distinguish:

`Milestone` — the reusable definition of a campaign progression award.
`MilestoneAward` — an individual occurrence where that milestone has been awarded.

This is one of the fundamental domain decisions of MAF-2.

### DM-003 Milestone identity uses a human-readable key

A milestone's canonical identity is:

```ts
key: string;
```

rather than a UUID or technical `id`.
Example:

```text
defeat-strahd
```

The rationale is that a GM should be able to recognise and reference the milestone easily.

The key is currently required to:

- be non-empty
- contain no whitespace

The concept of converting user-entered text into a slug is **deferred to the UI layer**, not part of the domain model.

### DM-004 Milestone name is separate from its identity

The milestone has both:

```ts
key: string;
name: string;
```

`key` provides stable identity while `name` provides the human-readable display name.

Changing the display name therefore does not change the milestone's identity.

### DM-005 Core Milestone data is defined

The required Milestone information is:

```ts
key: string;
name: string;
createdBy: MAFIdentity;
createdAt: Date;
```

Optional information is:

```ts
description?: string;
type?: MilestoneType;
metadata?: Record<string, unknown>;
```

### DM-006 Milestone categorisation uses an optional MilestoneType

`type` is an optional categorisation mechanism:

```ts
type?: MilestoneType;
```

The initial supported categories are:

- Completed quest
- Acquired significant item
- Defeated boss

These categories **do not introduce type-specific behaviour.**

The type model can be expanded/refactored later if actual requirements justify it.

### DM-007 Milestone creation provenance uses MAFIdentity

A milestone records:

```ts
createdBy: MAFIdentity;
createdAt: Date;
```

The domain therefore retains provenance information about when and by whom the milestone definition was created.

The domain does **not** determine how the identity is obtained.

The domain uses `MAFIdentity` rather than directly using Foundry's user representation. This keeps the domain independent of Foundry.

The specific mapping from a Foundry user to `MAFIdentity` is a **future implementation concern**.

### DM-008 MilestoneAward references a Milestone by milestoneKey

`MilestoneAward` contains:

```ts
milestoneKey: string;
```

rather than:

```ts
milestone: Milestone;
```

This deliberately makes the award a lightweight historical record identifying which milestone was awarded.

The relationship is therefore:

```text
Milestone
  key = "defeat-strahd"
        │
        ▼
MilestoneAward
  milestoneKey = "defeat-strahd"
```

### DM-009 MilestoneAward records awarding provenance

A `MilestoneAward` records:

```ts
awardedBy: MAFIdentity;
awardedAt: Date;
```

These are distinct from the milestone's `createdBy` and `createdAt`.

Therefore:

```text
Milestone.createdAt
    = when the milestone definition was created

MilestoneAward.awardedAt
    = when a particular award occurred
```

### DM-010 MilestoneAward reason is optional

An award may contain:

```ts
reason?: string;
```

This allows the GM or future implementation to record why or in what context the milestone was awarded.

It is deliberately **not required**.

If supplied, it cannot be empty or whitespace-only.

### DM-011 Domain metadata is extensible and opaque

Metadata is intentionally opaque to the MAF domain. MAF provides the storage mechanism but does not define the semantic meaning or schema of metadata values.

Both `Milestone` and `MilestoneAward` support:

```ts
metadata?: Record<string, unknown>;
```

### DM-012 The domain model contains no advancement logic

The domain objects do not determine:

- when a character advances
- whether a milestone qualifies someone for advancement
- what level someone reaches
- whether progression is ready
- advancement requirements

Those belong to subsequent MAF-2 stories.

### DM-013 The domain model is system and Foundry agnostic

The domain model contains no assumptions about:

- D&D 5e
- Pathfinder
- Shadowdark
- any other game system

System-specific information belongs behind the adapter architecture.

The domain objects have no dependency on:

- `game`
- `Actor`
- Foundry users
- Hooks
- Applications
- Foundry documents
- UI implementation

They can be instantiated and tested without a running Foundry world.

### DM-014 Domain invariants are enforced by domain objects

Domain invariants are validated when domain objects are constructed, preventing invalid domain objects from being created.

For example:

- keys cannot be empty
- keys cannot contain whitespace
- required identities cannot be empty
- supplied descriptions/reasons cannot be empty
- dates must be valid
- milestone types must be recognised values

Invalid domain state is rejected rather than allowing an invalid object to be created.

## Application Architecture

## Core Service Architecture

### Integration Point

Below shows how the Core Service Architecture is embedded into the Milestone Advancement Framework (MAF):

```text
Foundry / Application Layer
          │
          ▼
       Services
          │
          ▼
   System Adapter Layer
          │
          ▼
     Game System
```

### Current Service State

```text
                         ┌──────────────────────────┐
                         │    Foundry / UI Layer    │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────┐
                    │     MAF Application/Services  │
                    └───────────────┬───────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  ▼                                   ▼
       ┌──────────────────────┐          ┌────────────────────────┐
       │ Compatibility        │          │ Milestone Registration │
       │ Validator Service    │          │ Service                │
       │                      │          │                        │
       │ ICompatibility       │          │ IMilestoneRegistration │
       │ Validator            │          │ Service                │
       └──────────┬───────────┘          └───────────┬────────────┘
                  │                                  │
                  │                                  ▼
                  │                       ┌──────────────────────┐
                  │                       │      Milestone       │
                  │                       │    Domain Model      │
                  │                       └──────────────────────┘
                  │
                  │
                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │              System Adapter Framework                   │
       │                                                         │
       │                 SystemAdapterManager                    │
       │                         │                               │
       │              ┌──────────┴──────────┐                    │
       │              ▼                     ▼                    │
       │       ISystemAdapter        D&D 5e Adapter              │
       │                                      ...                │
       └─────────────────────────────────────────────────────────┘
```

### Key Decisions

The following is a list of the key decisions made surrounding the design of the Core Service Architecture:

| Identifier | Statement                                                                                       | Status   |
| ---------- | ----------------------------------------------------------------------------------------------- | -------- |
| CSA-001    | MAF Services encapsulate application/domain operations using explicit boundaries                | Accepted |
| CSA-002    | MAF Services will have a contract defined by an interface                                       | Accepted |
| CSA-003    | Milestone Advancement Service will orchestrate and provide access to MAF services               | Accepted |
| CSA-004    | Milestone service operations to be defined                                                      | Deferred |
| CSA-005    | Logger service provided through dependency injection to the MAF                                 | Accepted |
| CSA-006    | Compatibility Validator Service ensures compatibility with the game system and foundry versions | Accepted |
| CSA-007    | Milestone creation and registration are separate operations                                     | Accepted |
| CSA-008    | Milestone registration is implemented as a service                                              | Accepted |
| CSA-009    | The registration service has an interface                                                       | Accepted |
| CSA-010    | The milestone key is the registration identity                                                  | Accepted |
| CSA-011    | Milestone keys must be unique within the registration mechanism                                 | Accepted |
| CSA-012    | Registration preserves the domain Milestone                                                     | Accepted |
| CSA-013    | Domain validation remains the responsibility of the Milestone                                   | Accepted |
| CSA-014    | Registration is independent of awarding                                                         | Accepted |
| CSA-015    | Registration is system-agnostic                                                                 | Accepted |
| CSA-016    | Registration provides the retrieval boundary required by awarding                               | Accepted |

### CSA-001 MAF Services encapsulate application/domain operations using explicit boundaries

MAF services encapsulate application/domain operations and provide explicit boundaries between the domain model, system adapters, and Foundry/application infrastructure. Services are implemented as testable classes, with interfaces used where an explicit service contract is beneficial. System-specific behaviour is delegated to the system adapter layer rather than embedded within system-agnostic services.

### CSA-002 MAF Services will have a contract defined by an interface

MAF Services will have a contract, defined in an interface file using the following format:

{Service File Name}-interface.ts

The interface the members of the service without implementation, the class will implement the service contract.

### CSA-003 Milestone Advancement Service will orchestrate and provide access to MAF services

An important part of the module is orchestration which brings all of the functionality together. The Milestone Advancement Service will provide this function and provide access to the services and other functionality.

### CSA-004 Milestone service operations to be defined

The Milestone service operations are defined by its service contract. These operations are yet to be finalised.

### CSA-005 Logger service provided through dependency injection to the MAF

The Logger service which is one of the services managed by Milestone Advancement Service, will use dependency injection so that the Logger can be called whenever throughout the application as required.

```text
                    ┌──────────────────────────────┐
                    │     MAF Service / Component   │
                    │                              │
                    │  depends on ILogger           │
                    └──────────────┬───────────────┘
                                   │
                                   │ injected
                                   ▼
                         ┌───────────────────┐
                         │     ILogger       │
                         │    Interface      │
                         └─────────┬─────────┘
                                   ▲
                                   │ implements
                                   │
                         ┌─────────┴─────────┐
                         │ Logger Service /  │
                         │    Implementation │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Foundry / Console │
                         │   Logging Output  │
                         └───────────────────┘
```

Logger services are provided through dependency injection. MAF services depend on the ILogger abstraction rather than directly depending on a concrete logging implementation. The concrete logger is supplied by the MAF composition/bootstrap layer. This maintains service testability and prevents application/domain services from becoming coupled to a specific logging implementation.

### CSA-006 Compatibility Validator Service ensures compatibility with the game system and foundry versions

The Compatibility Validator Service ensures compatibility with the game system and foundry by validating whether it is compatible and ensuring that the core components are available. It checks:

- Foundry System is available
- Game System is available and supported by the module

Only if both passed does the Compatibility Validator Service allow the module to proceed.

### CSA-007 Milestone creation and registration are separate operations

### CSA-008 Milestone registration is implemented as a service

### CSA-009 The registration service has an interface

### CSA-010 The milestone key is the registration identity

### CSA-011 Milestone keys must be unique within the registration mechanism

### CSA-012 Registration preserves the domain Milestone

### CSA-013 Domain validation remains the responsibility of the Milestone

### CSA-014 Registration is independent of awarding

### CSA-015 Registration is system-agnostic

### CSA-016 Registration provides the retrieval boundary required by awarding

## System Adapter Architecture

## Logging

## Lifecycle Hooks

## Testing Architecture / Testing Strategy

### Key Decisions

The following is a list of the key decisions made surrounding the design of the Testing Architecture / Testing Strategy:

| Identifier | Statement                                                                          | Status   |
| ---------- | ---------------------------------------------------------------------------------- | -------- |
| TAS-001    | Acceptance criteria determine required behaviour, not necessarily individual tests | Accepted |

### TAS-001 Acceptance criteria determine required behaviour, not necessarily individual tests

Each acceptance criterion should be assessed to determine the most appropriate form of verification. Behavioural requirements should generally be covered by automated tests, while architectural boundaries, design constraints, and domain responsibilities may be verified through implementation review and documented design decisions. Tests should provide meaningful behavioural assurance rather than exist solely to achieve one-to-one coverage of acceptance criteria.
