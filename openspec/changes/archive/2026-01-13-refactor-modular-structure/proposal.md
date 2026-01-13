# Change: Refactor codebase to modular structure with explicit access modifiers

## Why
The current single-file architecture (`index.ts`) has grown to 365+ lines and will become increasingly difficult to maintain as features are added. A modular structure with clear separation of concerns will improve code organization, maintainability, and testability. Adding explicit access modifiers (public/private/internal) with consistent naming conventions will make the codebase more self-documenting and help prevent unintended usage of internal implementation details.

## What Changes
- **BREAKING**: Restructure from single-file (`index.ts`) to modular directory structure
  - Create `src/` directory with organized modules (types, config, providers, cli, utils)
  - Export public API from `index.ts` as barrel file
  - Move type definitions to `src/types/`
  - Move config management to `src/config/`
  - Move LLM provider implementations to `src/providers/`
  - Move CLI interface to `src/cli/`
- Add explicit access modifiers to all classes, properties, methods, and interfaces
  - Public members use PascalCase (e.g., `GenerateCommand`, `LoadConfig`)
  - Private/internal members use underscore+pascalCase (e.g., `_callOpenAI`, `_config`)
  - Mark interfaces as `public` or `internal` as appropriate
- **BREAKING**: Update AGENTS.md and openspec/project.md to reflect modular architecture
- Update package.json build scripts to compile from src/ structure
- Maintain same external API and CLI behavior
- Ensure all imports work correctly after restructuring

## Impact
- Affected specs: core (architecture, tech stack, and constraints)
- Affected code: Complete restructuring of index.ts into src/ directory
- Breaking change: Source code structure changes (external CLI interface remains unchanged)
- Migration path: Developers must update development workflows to work with modular structure
