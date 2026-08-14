# Domain Model

This document describes the Domain Model of the Milestone Advancement Framework (MAF) and each element.

## Milestone

A Milestone represents an **award/prize representing meaningful campaign progression**.

It is not:

- an objective
- a task
- an advancement requirement
- progression state

### Milestone Identity

The canonical identity is a human-readable `key: string`, rather than a UUID.

```text
defeat-strahd
```

The key must currently be non-empty and contain no whitespace.

We deliberately chose `key` rather than `id` because it is meaningful to a GM and can be used as a stable domain reference.

_Deferred_: the UI may eventually convert human-entered text such as `Defeat Strahd` into a slug such as `defeat-strahd`.

### Milestone Data

The current model requires:

```text
key
name
createdBy
createdAt
```

Optional:

```text
description
type
metadata
```

`name` remains distinct from `key`: the key provides stable identity while the name provides human-readable presentation.

### Milestone Type

`MilestoneType` is currently an **optional categorisation mechanism**, with initial values:

```text
completed quest
acquired significant item
defeated boss
```

These types do not introduce different behaviours.

**Deferred:** the type model may be expanded or refactored if future registration/compendium requirements demonstrate a need.

## MAF Identity

`createdBy` and `awardedBy` use the domain-level `MAFIdentity`.

The domain does not determine how an identity is obtained.

**Deferred:** mapping Foundry's current user identity to `MAFIdentity` can be addressed by a future story.

## MilestoneAward

A `MilestoneAward` represents an **award/**