# Contributing to Yokter Kit

## Development Setup

```bash
# Clone the repo
git clone <repo-url>
cd yokter-kit

# Install dependencies
yarn install

# Build
yarn build

# Lint
yarn lint
yarn lint:fix
```

## Project Structure

```
src/
  components/     # Form, FormItem
  context/        # YokterProvider
  hooks/          # useForm, useList, useCreate, etc.
  types/          # DataProvider, I18nProvider, etc.
  utils/          # Query key helpers
  clients/        # React Query client
  index.ts        # Barrel export (public API)
examples/
  crud/           # Expo Go CRUD demo app
```

## Workflow

### 1. Create a feature branch

```bash
git checkout -b feature/my-feature
```

### 2. Make changes

- All public API must be exported from `src/index.ts`
- Run `yarn build` to verify there are no TypeScript errors
- Run `yarn lint` before committing

### 3. Commit and push

```bash
git add .
git commit -m "feat: add xyz"
git push -u origin feature/my-feature
```

### 4. Open a PR

Open a pull request against `main`. Describe what changed and why.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes (removed/renamed exports, changed hook signatures, provider prop changes)
- **MINOR** (1.0.0 -> 1.1.0): New features that are backwards-compatible (new hooks, new optional props, new exports)
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, internal refactors, docs updates

### Bumping the version

```bash
# Patch release (bug fix)
npm version patch

# Minor release (new feature)
npm version minor

# Major release (breaking change)
npm version major
```

This updates `package.json` version and creates a git tag.

## Publishing to npm

### First time setup

```bash
npm login
```

### Publishing

```bash
# Make sure you're on main with a clean working tree
git checkout main
git pull

# Build fresh
rm -rf dist
yarn build

# Verify what will be published
npm pack --dry-run

# Bump version (pick one)
npm version patch   # or minor / major

# Publish
npm publish

# Push the version tag
git push && git push --tags
```

### Pre-release versions

For testing before an official release:

```bash
# Beta
npm version prerelease --preid=beta   # 0.1.1-beta.0
npm publish --tag beta

# Users install with:
yarn add yokter-kit@beta
```

## Release Checklist

1. All changes merged to `main`
2. `yarn build` passes
3. `yarn lint` passes
4. Version bumped appropriately
5. `npm pack --dry-run` shows only expected files (check `"files"` in package.json)
6. Published to npm
7. Git tag pushed

## Adding a New Hook

1. Create `src/hooks/use-my-hook.tsx`
2. Export it from `src/index.ts`
3. Add it to the Hooks table in `README.md`
4. Add usage to the relevant example app if applicable

## Adding a New Example

1. Create a new directory under `examples/`
2. Initialize with `npx create-expo-app@latest examples/my-example`
3. Add a `metro.config.js` that watches `../../src` for live development:

```js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);
config.watchFolders = [path.resolve(monorepoRoot, "src")];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

module.exports = config;
```

## Code Guidelines

- No default exports
- Hooks return objects (not arrays) for named destructuring
- Peer dependencies (`react`, `react-native`, `react-hook-form`, `@tanstack/react-query`) are never imported as direct dependencies
- Keep the public API surface minimal — only export what consumers need
