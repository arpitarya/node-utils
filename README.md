# @apec1/node-utils

Utilities for Node.js apps that need reliable path resolution and predictable `.env` loading in workspace/monorepo setups.

## Why this package

- Resolve paths from either workspace root or current package directory
- Load layered `.env` files with one function call
- Keep setup small and dependency-light
- Ship ESM + CJS + TypeScript types

## Requirements

- Node.js `>=20`

## Installation

```bash
pnpm add @apec1/node-utils
# npm install @apec1/node-utils
# yarn add @apec1/node-utils
```

## Quick Start

```ts
import {
  syncExpandDotEnv,
  resolveRootPath,
  resolveWorkspaceDirectory,
} from "@apec1/node-utils";

process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
await syncExpandDotEnv(".env");

const appConfigPath = resolveRootPath("config/app.json");
const localLogPath = resolveWorkspaceDirectory("tmp/app.log");

console.log({ appConfigPath, localLogPath });
```

## API Reference

### `syncExpandDotEnv(path: string): Promise<void>`

Loads environment files in this order (if they exist):

1. `${path}.${NODE_ENV}.local`
2. `${path}.${NODE_ENV}`
3. `${path}.local` (skipped when `NODE_ENV === "test"`)
4. `${path}`

Example:

```ts
import { syncExpandDotEnv } from "@apec1/node-utils";

process.env.NODE_ENV = "production";
await syncExpandDotEnv(".env");
```

### `asyncExpandDotEnv(path: string): Promise<void>`

Asynchronous `.env` loader with the same file precedence as `syncExpandDotEnv`.

```ts
import { asyncExpandDotEnv } from "@apec1/node-utils";

await asyncExpandDotEnv(".env");
```

### `resolveRootPath(relativePath: string): string`

Resolves a path relative to detected root working directory (`ROOT_WORKING_DIRECTORY`) and falls back to `process.cwd()`.

```ts
import { resolveRootPath } from "@apec1/node-utils";

const absolutePath = resolveRootPath("packages/api/src/index.ts");
```

### `resolveWorkspaceDirectory(relativePath: string): string`

Resolves a path relative to the current process working directory.

```ts
import { resolveWorkspaceDirectory } from "@apec1/node-utils";

const absolutePath = resolveWorkspaceDirectory("src/index.ts");
```

## Environment Variables

- `NODE_ENV`:
  - Influences dotenv file selection
  - Set this explicitly for deterministic loading behavior
- `ROOT_WORKING_DIRECTORY`:
  - Optional override for root path resolution
- `ENABLE_WORKING_DIR_LOGS_LEVEL`:
  - Internal path-resolution logging level (`none`, `info`, `verbose`)

## Common Usage Patterns

### Monorepo bootstrap

```ts
import { syncExpandDotEnv, resolveRootPath } from "@apec1/node-utils";

await syncExpandDotEnv(".env");
const dbConfigPath = resolveRootPath("packages/api/config/database.json");
```

### Package-local paths

```ts
import { resolveWorkspaceDirectory } from "@apec1/node-utils";

const migrationDir = resolveWorkspaceDirectory("migrations");
```

## Development

```bash
pnpm install
pnpm build
pnpm test
```

Scripts:

- `pnpm build` — build package with `rslib`
- `pnpm dev` — dev/watch build with `rslib`
- `pnpm test` — run tests with `rstest`

## Package Output

- ESM: `dist/index.mjs`
- CJS: `dist/index.cjs`
- Types: `dist/index.d.ts`

## License

MIT
