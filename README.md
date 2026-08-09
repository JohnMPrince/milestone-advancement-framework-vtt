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
