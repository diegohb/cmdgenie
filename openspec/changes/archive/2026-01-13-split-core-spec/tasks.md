## 1. Create NonFunctional-Codebase Spec
- [x] Create `openspec/specs/nonfunctional-codebase/` directory
- [x] Create `openspec/specs/nonfunctional-codebase/spec.md` with non-functional requirements
- [x] Move 13 requirements from core spec: Tech Stack, Type Safety, Build Process, TypeScript Configuration, Type Definitions, Documentation Updates, Modular Architecture, Explicit Access Modifiers, Naming Conventions, Backward Compatibility, Jest Testing Framework, Test Coverage, Code Linting with Oxlint

## 2. Create Functional-Core Spec
- [x] Create `openspec/specs/functional-core/` directory
- [x] Create `openspec/specs/functional-core/spec.md` with functional requirements
- [x] Move 7 requirements from core spec: Provider Registry Persistence, Provider Management Commands

## 3. Update Core Spec
- [x] Decide whether to keep core as index or remove entirely
- [x] If keeping, update core spec to reference the two new specs
- [x] Remove moved requirements from core spec

## 4. Validation and Testing
- [x] Run `openspec validate --all` to ensure all specs are valid
- [x] Verify no requirements are lost or duplicated
- [x] Check that existing changes still reference correct specs</content>
<parameter name="filePath">openspec/changes/split-core-spec/tasks.md