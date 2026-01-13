# Change: Add Oxlint Linting

## Why
The project currently relies on manual code style adherence with "no linting" policy. Adding Oxlint will provide automated code quality checks, catch common issues early, and ensure consistent coding standards across the team. Oxlint is fast and suitable for CI/CD pipelines, improving development efficiency and code reliability.

## What Changes
- Install oxlint as a dev dependency
- Configure oxlint for the TypeScript codebase
- Update package.json test script to include linting validation
- Add linting rules appropriate for the project's style

## Impact
- Affected specs: core
- Affected code: package.json, new .oxlintrc.json config file
- Changes project from "no linting" to automated linting