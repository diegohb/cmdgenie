# Change: Convert codebase to TypeScript

## Why
To improve code maintainability, type safety, and developer experience. TypeScript provides static type checking, better IDE support, and catches errors at compile time rather than runtime. This change will make the codebase more robust and easier to maintain as features are added.

## What Changes
- Convert `index.js` to `index.ts` with full type annotations
- Add TypeScript as dev dependency with appropriate type definitions
- Create `tsconfig.json` for TypeScript compilation
- Update `package.json` with build scripts and new dependencies
- **BREAKING**: Update AGENTS.md and openspec/project.md to reflect TypeScript adoption
- **BREAKING**: Update package.json main entry point to compiled JavaScript
- Add `@types/node` for Node.js built-in types
- Configure build process to compile TypeScript to JavaScript
- Update shebang to point to compiled output
- Maintain single-file architecture with TypeScript

## Impact
- Affected specs: core (tech stack and constraints)
- Affected code: index.js → index.ts, package.json, AGENTS.md, openspec/project.md
- Migration path: Users will need to run `npm run build` after install
- Breaking change: Repository now requires TypeScript to build from source
