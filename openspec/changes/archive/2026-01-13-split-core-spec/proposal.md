# Change: Split Core Spec into NonFunctional-Codebase and Functional-Core

## Why
The current "core" spec has grown to contain both functional requirements (what the product does) and non-functional requirements (how the codebase is structured and quality assured). This mixing makes it harder to maintain and understand. Splitting into focused specs improves organization and allows for better separation of concerns.

## What Changes
- Create new spec: `openspec/specs/nonfunctional-codebase/spec.md` for codebase quality requirements
- Create new spec: `openspec/specs/functional-core/spec.md` for product functionality requirements  
- Move 13 non-functional requirements from core to nonfunctional-codebase
- Move 7 functional requirements from core to functional-core
- Keep core spec as minimal index or remove entirely
- Update any references to use the new spec locations

## Impact
- Affected specs: core (split into two), nonfunctional-codebase (new), functional-core (new)
- No code changes required - this is purely organizational
- Improves maintainability and clarity of requirements</content>
<parameter name="filePath">openspec/changes/split-core-spec/proposal.md