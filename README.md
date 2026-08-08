# Milestone Advancement Framework for Foundry VTT

A Foundry VTT version 14 compatible project built to provide milestone advancement framework for supported systems on Foundry VTT.

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
