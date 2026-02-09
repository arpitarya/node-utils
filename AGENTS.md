# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sentenel is a polyglot project using Python 3.14 and Node.js 24.

## Development Setup

Bootstrap the environment (installs pdm, pnpm, dependencies, and Playwright browsers):
```bash
./setup.sh
```

Clean up caches and build artifacts:
```bash
./clean.sh
```

## Package Management

**Python** - Uses PDM with uv backend:
```bash
pdm install              # Install dependencies
pdm add <package>        # Add dependency
pdm run <command>        # Run command in venv
```

**JavaScript/TypeScript** - Uses pnpm:
```bash
pnpm install             # Install dependencies
pnpm add <package>       # Add dependency
```

## Linting & Formatting

**Python** - Uses Ruff (line-length: 120, target: py314):
```bash
pdm run ruff check .     # Lint
pdm run ruff check --fix # Lint with auto-fix
pdm run ruff format .    # Format
```

Selected Ruff rules: E (errors), F (pyflakes), W (warnings), I (isort)

**Spell checking** - Uses cspell:
```bash
pnpm exec cspell "**/*"
```

Custom dictionary at `.cspell/general.cspell.txt`.

## Testing

Playwright is configured for browser testing:
```bash
pdm run playwright test          # Run tests
pdm run playwright install       # Install browsers
```

## Code Style

- Indent: 2 spaces (all files)
- Line endings: LF
- Final newline: yes
- Trim trailing whitespace: yes (except .md files)
