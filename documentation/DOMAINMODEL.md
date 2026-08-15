# Domain Model

This document describes the Domain Model of the Milestone Advancement Framework (MAF).

The domain model defines the system-agnostic concepts used to represent milestones and milestone awards. It intentionally contains no Foundry VTT, game-system, UI, or advancement-specific concerns.

## Domain Model Overview

The current MAF domain model consists of:

| Concept          | Responsibility                                     |
| ---------------- | -------------------------------------------------- |
| `Milestone`      | Defines a reusable campaign progression award      |
| `MilestoneAward` | Records an occurrence of a milestone being awarded |
| `MAFIdentity`    | Represents an identity within the MAF domain       |
| `MilestoneType`  | Categorises a milestone                            |

## Milestone

A `Milestone` represents an **award/prize representing meaningful campaign progression**.

It is not:

- an objective
- a task
- an advancement requirement
- progression state

### Milestone Structure

```typescript
interface MilestoneData {
  key: string;
  name: string;
  description?: string;
  type?: MilestoneType;
  createdBy: MAFIdentity;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}
```

### Milestone Properties

| Property      | Type                      | Required | Description                                      |
| ------------- | ------------------------- | :------: | ------------------------------------------------ |
| `key`         | `string`                  |   Yes    | Stable, human-readable identity of the milestone |
| `name`        | `string`                  |   Yes    | Human-readable name of the milestone             |
| `description` | `string`                  |    No    | Additional description or context                |
| `type`        | `MilestoneType`           |    No    | Optional milestone categorisation                |
| `createdBy`   | `MAFIdentity`             |   Yes    | Identity of the creator                          |
| `createdAt`   | `Date`                    |   Yes    | Date and time the milestone was created          |
| `metadata`    | `Record<string, unknown>` |    No    | Optional campaign-specific metadata              |

### Milestone Property: Key

The `key` is the canonical identity of a milestone.

Keys are human-readable strings rather than technical identifiers such as UUIDs.

For example:

```text
defeat-strahd
```

The current domain rules require a key to:

- be non-empty
- contain no whitespace

The domain does not currently perform slug generation. Converting user-entered text such as `Defeat Strahd` into `defeat-strahd` is considered a UI concern.

### Milestone Property: Name

The `name` provides the human-readable display name of the milestone.

The name is deliberately separate from the milestone key. Changing the display name does not change the milestone's identity.

For example:

```text
key:  defeat-strahd
name: Defeat Strahd
```

### Milestone Property: Description

A description is optional.

If supplied, it must contain meaningful content and cannot consist solely of whitespace.

### Milestone Property: Type

A milestone may optionally be assigned a `MilestoneType`.

The initial supported milestone types are:

- Completed quest
- Acquired significant item
- Defeated boss

`MilestoneType` currently provides categorisation only. The type does not introduce type-specific behaviour.

The type model may be expanded or refactored in the future if requirements justify it.

### Milestone Creation Provenance

Each milestone records:

```ts
createdBy: MAFIdentity;
createdAt: Date;
```

This allows the domain to retain information about when and by whom the milestone definition was created.

The domain does not determine how the identity is obtained.

## MilestoneAward

A `MilestoneAward` represents an individual occurrence where a milestone has been awarded.

A `MilestoneAward` is distinct from the reusable `Milestone` definition.

### MilestoneAward Structure

```ts
interface MilestoneAwardData {
  milestoneKey: string;
  awardedBy: MAFIdentity;
  awardedAt: Date;
  reason?: string;
  metadata?: Record<string, unknown>;
}
```

### MilestoneAward Properties

| Property       | Type                      | Required | Description                                   |
| -------------- | ------------------------- | :------: | --------------------------------------------- |
| `milestoneKey` | `string`                  |   Yes    | Key identifying the awarded milestone         |
| `awardedBy`    | `MAFIdentity`             |   Yes    | Identity of the person awarding the milestone |
| `awardedAt`    | `Date`                    |   Yes    | Date and time the milestone was awarded       |
| `reason`       | `string`                  |    No    | Optional reason or context for the award      |
| `metadata`     | `Record<string, unknown>` |    No    | Optional campaign-specific metadata           |

### MilestoneAward Property: milestoneKey (Milestone Reference)

A `MilestoneAward` references its milestone using the milestone's stable key:

```ts
milestoneKey: string;
```

It does not contain a `Milestone` instance.

For example:

```text
Milestone
  key = "defeat-strahd"
        │
        ▼
MilestoneAward
  milestoneKey = "defeat-strahd"
```

This keeps the award as a lightweight historical record of an award event.

### MilestoneAward Creation Provenance

Each award records:

```ts
awardedBy: MAFIdentity;
awardedAt: Date;
```

These represent the person responsible for awarding the milestone and the time at which the award occurred.

They are distinct from the milestone's creation provenance:

```text
Milestone.createdAt
    = when the milestone definition was created

MilestoneAward.awardedAt
    = when a particular award occurred
```

### MilestoneAward Property: Reason

An award may optionally include a reason or contextual explanation:

```ts
reason?: string;
```

If supplied, the reason must contain meaningful content and cannot consist solely of whitespace.

## MAFIdentity

`MAFIdentity` represents an identity within the MAF domain.

It is used by domain objects to record provenance without introducing a dependency on a specific implementation or platform identity system.

For example:

```ts
createdBy: MAFIdentity;
awardedBy: MAFIdentity;
```

The domain does not determine how an identity is obtained.

The mapping between an implementation-specific identity, such as a Foundry user, and MAFIdentity belongs outside the domain model.

## MilestoneType

`MilestoneType` provides optional categorisation for milestones.

The initial values are:

```text
Completed quest
Acquired significant item
Defeated boss
```

The type currently has no behavioural significance within the domain.

Future requirements may expand or refactor the type model.

## Metadata

Both `Milestone` and `MilestoneAward` support optional metadata:

```ts
metadata?: Record<string, unknown>;
```

Metadata is intentionally opaque to the MAF domain.

MAF provides the mechanism for storing additional information but does not define the semantic meaning or schema of metadata values.

This allows campaign-specific contextual information to be associated with domain objects without introducing system-specific assumptions.

## Domain Invariants

The domain objects enforce their basic invariants when constructed.

### Milestone

A `Milestone` must:

- have a non-empty `key`
- have a `key` containing no whitespace
- have a non-empty `name`
- have a non-empty `description` when specified
- have a valid `MilestoneType` when specified
- have a valid `createdBy`
- have a valid `createdAt` date

### MilestoneAward

A MilestoneAward must:

- have a non-empty `milestoneKey`
- have a `milestoneKey` containing no whitespace
- have a valid `awardedBy`
- have a valid `awardedAt` date
- have a non-empty `reason` when specified

Invalid domain state is rejected during construction rather than allowing an invalid domain object to be created.

## Domain Boundaries

The domain model deliberately excludes concerns that belong to other areas of MAF.

### Advancement

The domain does not contain:

- advancement requirements
- progression state
- character levels
- target levels
- XP
- advancement eligibility
- advancement decisions

These concerns are addressed by subsequent MAF services and domain concepts.

### Game Systems

The domain model does not contain game-system-specific information.

It does not assume:

- D&D 5e
- Pathfinder
- Shadowdark
- or any other specific game system

System-specific behaviour belongs behind the system adapter architecture.

### Foundry VTT

The domain model does not depend on Foundry VTT APIs or runtime objects.

It does not directly depend on:

- `game`
- `Actor`
- Foundry users
- Hooks
- Applications
- Foundry Documents
- UI components

The domain can therefore be instantiated and tested independently of a running Foundry world.

## Domain Relationships

The current conceptual relationship between the primary domain objects is:

```text
┌─────────────┐
│  Milestone  │
│─────────────│
│ key         │
│ name        │
│ description │
│ type        │
│ createdBy   │
│ createdAt   │
│ metadata    │
└──────┬──────┘
       │
       │ referenced by key
       ▼
┌─────────────────┐
│ MilestoneAward  │
│─────────────────│
│ milestoneKey    │
│ awardedBy       │
│ awardedAt       │
│ reason          │
│ metadata        │
└─────────────────┘
```

`MAFIdentity` is used by both objects to represent provenance, while `MilestoneType` provides optional categorisation of a milestone.

## Future Considerations

The following concerns have deliberately been left open for future work:

- Slug generation for milestone keys
- Mapping Foundry users to `MAFIdentity`
- Expansion or refactoring of `MilestoneType`
- Definition of campaign-specific metadata schemas
- Additional persistence-specific identifiers if required
- Centralisation or localisation of domain error messages

These are not required for the current domain model and should only be introduced when a concrete requirement justifies them.
