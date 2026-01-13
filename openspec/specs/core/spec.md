# Core Specification

## Purpose
The core specification has been split into focused specifications for better organization:

- **NonFunctional-Codebase**: Requirements for codebase quality, development practices, testing, and architecture
- **Functional-Core**: Requirements for product functionality, CLI commands, and user-facing features

## See Also
- [NonFunctional-Codebase Specification](../nonfunctional-codebase/spec.md)
- [Functional-Core Specification](../functional-core/spec.md)

## Requirements

### Requirement: Specification Organization
The project SHALL maintain organized specifications split by functional and non-functional concerns.

#### Scenario: Specification references
- **GIVEN** the core specification
- **WHEN** developers need requirements
- **THEN** they are directed to specialized specifications
- **AND** NonFunctional-Codebase contains codebase quality requirements
- **AND** Functional-Core contains product functionality requirements
