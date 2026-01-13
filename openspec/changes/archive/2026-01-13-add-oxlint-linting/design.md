## Context
The project currently has a "no linting" policy as stated in project.md, relying on manual code reviews and TypeScript compilation for code quality. Adding automated linting will shift to proactive error detection.

## Goals / Non-Goals
- Goals: Improve code quality, catch issues early, standardize code style
- Non-Goals: Replace manual reviews, add complex linting rules that conflict with existing code

## Decisions
- **Linter Choice**: Oxlint chosen for its speed and TypeScript support, suitable for CI/CD
- **Configuration**: Minimal rules focused on common issues, not overly restrictive
- **Integration**: Lint as part of test script to ensure it runs in CI/CD

## Risks / Trade-offs
- **Adoption**: Team needs to adjust to linting rules
- **Performance**: Oxlint is fast, minimal impact on build times
- **False Positives**: Rules configured to minimize noise

## Migration Plan
- Add linting gradually, fix existing issues first
- Update CI/CD pipelines to include linting step
- Document linting standards in contribution guidelines