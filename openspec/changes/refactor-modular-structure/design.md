# Design: Modular Structure Refactor

## Context
The CmdGenie project currently uses a single-file architecture (`index.ts` with 365+ lines) that contains all functionality. While simple, this approach has limitations:
- Code organization becomes unclear as features grow
- Testing individual components is difficult
- Reusability across modules is limited
- Access boundaries are implicit rather than explicit

The project needs to evolve to a more maintainable structure while preserving the existing external API and CLI behavior.

## Goals / Non-Goals

### Goals
- Improve code organization through logical module separation
- Add explicit access modifiers (public/private/internal) to all types and members
- Establish consistent naming conventions:
  - Public members: PascalCase (e.g., `GenerateCommand`, `LoadConfig`)
  - Private/internal members: underscore+pascalCase (e.g., `_callOpenAI`, `_validateConfig`)
- Maintain backward compatibility of the external CLI interface
- Enable easier future testing and maintenance
- Keep the compiled output functionally identical to current behavior

### Non-Goals
- Changing the external API or CLI behavior
- Adding automated tests (still manual testing only)
- Introducing new features or capabilities
- Changing the build output location or structure
- Modifying the LLM provider implementations beyond access modifiers

## Decisions

### Decision 1: Directory Structure
**Choice**: Create `src/` directory with the following module organization:
```
src/
├── types/
│   ├── index.ts           # Core types (Config, ProviderConfig)
│   └── providers.ts       # Provider response types (internal)
├── config/
│   ├── constants.ts       # CONFIG_DIR, CONFIG_FILE
│   └── index.ts           # ConfigManager class
├── providers/
│   ├── base.ts            # Base Provider interface
│   ├── openai.ts          # OpenAI implementation
│   ├── anthropic.ts       # Anthropic implementation
│   ├── google.ts          # Google implementation
│   ├── cohere.ts          # Cohere implementation
│   └── registry.ts        # Provider configurations
├── cli/
│   └── index.ts           # CLIHandler class
└── index.ts               # Main entry point and exports
```

**Rationale**: This structure separates concerns by responsibility, making it easy to locate and modify specific functionality. The `src/` prefix is standard for TypeScript projects and clearly distinguishes source from build output.

**Alternatives considered**:
- Keeping single-file but adding access modifiers (rejected: doesn't solve organization)
- Using a `lib/` directory instead of `src/` (rejected: `src/` is more conventional)
- Separating each provider into its own package (rejected: over-engineering for current needs)

### Decision 2: Access Modifier Strategy
**Choice**: Apply explicit modifiers to all declarations:
- Classes: `public class` or `internal class` (no modifiers means public in TS)
- Interfaces: `public interface` or `internal interface`
- Methods: `public MethodName()` or `private _methodName()`
- Properties: `public PropertyName: Type` or `private _propertyName: Type`
- Constants: `public readonly CONSTANT_NAME` or `private readonly _constantName`

**Rationale**: Explicit modifiers make code intent clear and prevent accidental misuse. The naming convention (PascalCase for public, underscore+pascalCase for private) provides visual cues without needing to read type declarations.

**Alternatives considered**:
- Relying on TypeScript's default public modifier (rejected: not explicit enough)
- Using lowercase for private members (rejected: doesn't align with existing conventions)
- Using TypeScript's `#private` fields (rejected: still experimental and changes behavior)

### Decision 3: Naming Convention
**Choice**:
- Public members: PascalCase (e.g., `GenerateCommand`, `Config`)
- Private/internal members: underscore+pascalCase (e.g., `_generateCommand`, `_config`)
- Constants: UPPER_SNAKE_CASE (e.g., `CONFIG_DIR`, `MAX_TOKENS`)

**Rationale**: This convention aligns with common TypeScript practices and makes member visibility immediately obvious in code. The underscore prefix is widely recognized as indicating private/internal scope.

**Alternatives considered**:
- camelCase for all members (rejected: no visual distinction between public/private)
- Using TypeScript's `private` keyword only (rejected: doesn't provide visual cue)
- Hungarian notation (rejected: outdated and verbose)

### Decision 4: Public API Surface
**Choice**: Maintain CmdGenie class as the main public API, re-exporting from index.ts:
```typescript
// index.ts
export { CmdGenie } from './cli';
export type { Config, ProviderConfig } from './types';
```

**Rationale**: Preserves backward compatibility with any code that imports CmdGenie. The barrel export pattern is idiomatic TypeScript.

**Alternatives considered**:
- Exposing individual classes/modules (rejected: larger API surface than needed)
- Creating a separate API layer (rejected: adds unnecessary complexity)

### Decision 5: Module Import Strategy
**Choice**: Use relative imports within src/ directory:
```typescript
import { Config } from '../types';
import { ConfigManager } from '../config';
```

**Rationale**: Simplicity and clarity. Avoids aliasing complexity.

**Alternatives considered**:
- Absolute imports with path mapping (rejected: over-engineering for current size)
- Barrel exports from every directory (rejected: creates circular dependency risks)

## Risks / Trade-offs

### Risk 1: Breaking existing development workflows
**Mitigation**: Update AGENTS.md and project.md with clear instructions for the new structure. Maintain same CLI behavior to minimize end-user impact.

### Risk 2: Circular dependencies during refactor
**Mitigation**: Carefully design module dependencies to be acyclic. Use dependency injection where needed. Test compilation frequently.

### Risk 3: Introducing bugs during code movement
**Mitigation**: Move code incrementally, testing after each module extraction. Keep manual testing thorough with all LLM providers.

### Trade-off: Increased file count vs. better organization
**Trade-off decision**: More files is acceptable given the maintainability benefits. The modular structure will pay dividends as the codebase grows.

### Trade-off: More complex import statements vs. explicit dependencies
**Trade-off decision**: Explicit imports are a feature, not a bug. They make dependencies clear and improve IDE support.

## Migration Plan

### Steps
1. Create directory structure (empty)
2. Extract and test types module
3. Extract and test config module
4. Extract and test providers module
5. Extract and test CLI module
6. Update main entry point
7. Update build configuration
8. Update documentation
9. Thorough manual testing

### Rollback
If issues arise, revert to single-file index.ts using git. The refactor will be done on a separate branch, so main branch remains stable throughout.

### Testing Strategy
- Build after each module extraction
- Test CLI functionality (help, update-llm, command generation)
- Test with all four LLM providers
- Verify cross-platform behavior (macOS, Windows, Linux)
- Ensure no TypeScript errors

## Open Questions

### Question 1: Should provider response types be public or internal?
**Current thinking**: Make them internal since they're implementation details of each provider. The public interface is the provider's Execute method returning a string command.

### Question 2: How should constants be organized?
**Current thinking**: Keep module-specific constants in their respective modules (e.g., API endpoints in provider modules). Shared constants go in utils/constants.ts.

### Question 3: Should ConfigManager be a class or set of functions?
**Current thinking**: Use a class to encapsulate config state and provide clear object-oriented API with LoadConfig, SaveConfig, etc.

### Question 4: Should we create an interface for all providers?
**Current thinking**: Yes, create a Provider interface with Execute method and metadata. This enables future extensibility and clearer contracts.

## Implementation Notes

- Move code incrementally, testing after each step
- Run `npm run build` after each module extraction to catch errors early
- Use TypeScript's `export { }` syntax for barrel exports
- Keep the shebang (`#!/usr/bin/env node`) only in the compiled dist/index.js
- Ensure all imports work correctly with the new structure
- Maintain the same external CLI behavior and output format
