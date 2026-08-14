# Project Architecture

This document describes the architecture and decisions made via the process of designing the Milestone Advancement Framework (MAF).

This will broken down by subject area to make it easier to identify specific decisions.

## Domain Model

### Key Decisions

The following is a list of the key decisions made surrounding the design of the Domain Model:

| Identifier | Statement                                          | Status   |
| ---------- | -------------------------------------------------- | -------- |
| DM-001     | A milestone represents campaign progression        | complete |
| DM-002     | Milestone and MilestoneAward are distinct concepts | complete |
| DM-003     | Milestone identity uses a human-readable `key`     | complete |
| DM-004     | Milestone `name` is separate from its identity     | complete |
| DM-005     | Core Milestone data defined                        | complete |

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

The rationale is that a GM should be able to recognise and ereference the milestone easily.

The key is currently required to:

- be non-empty
- contain no whitespace

The concept of converting user-entered text into a slug is **deferred to the UI layer**, not part of the domain model.

## Application Architecture

## Core Service Architecture

## System Adapter

## Logging

## Lifecycle Hooks

## Testing Architecture
