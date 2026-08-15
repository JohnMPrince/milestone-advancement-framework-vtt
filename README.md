# Milestone Advancement Framework for Foundry VTT

A system-agnostic Foundry VTT v14 framework for implementing milestone
advancement functionality across supported game systems.

## Current Status

MAF is currently under active development.

The framework currently provides:

- Core service architecture
- System Adapter architecture
- Foundry VTT lifecycle integration
- Settings framework
- Logging framework
- Application Framework
- D&D 5e System Adapter
- Vite build and packaging
- Automated CI validation

## Supported Systems

Currently supported:

- D&D 5e

Additional systems will be supported through the System Adapter architecture.

## Development

MAF is written in TypeScript and uses Vite, ESLint and Prettier.

Before submitting changes:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Documentation

- `documentation/ARCHITECTURE.md` - Architectural decisions and reasoning.
- `documentation/DEVELOPMENTNOTES.md` — Development conventions and implementation guidance.
- `documentation/DOMAINMODEL.md` - Describes the Domain Model that is used by the module.
- `documentation/RELEASENOTES.md` — Release history and notable changes.
