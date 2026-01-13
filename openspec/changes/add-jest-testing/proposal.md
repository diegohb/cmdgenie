# Change: Add Jest Unit Tests and Integration Tests

## Why
The project currently relies on manual testing only, which is inefficient and error-prone. Adding Jest will provide automated testing capabilities to ensure code quality, catch regressions early, and support future development. This change introduces proper testing infrastructure while maintaining the project's modular architecture.

## What Changes
- Add Jest as a dev dependency with TypeScript support
- Create unit tests for core modules (config, providers, CLI)
- Add integration tests for end-to-end command generation workflow
- Update package.json with test scripts
- Add test configuration and setup files

## Impact
- Affected specs: core
- Affected code: New test files in src/ directory, package.json updates
- No breaking changes to existing CLI functionality