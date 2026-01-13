## ADDED Requirements
### Requirement: Tech Stack
The project SHALL use TypeScript for type safety and better development experience.

#### Scenario: TypeScript setup
- **GIVEN** a fresh project clone
- **WHEN** developer runs `npm install`
- **THEN** TypeScript and @types/node are installed as devDependencies
- **AND** tsconfig.json is present with appropriate configuration

#### Scenario: TypeScript compilation
- **GIVEN** TypeScript source code in index.ts
- **WHEN** developer runs `npm run build`
- **THEN** TypeScript compiles to JavaScript
- **AND** Compiled JavaScript is output to dist/index.js
- **AND** No type errors are reported

### Requirement: Single-File Architecture
The project SHALL maintain single-file architecture while using TypeScript.

#### Scenario: Single TypeScript file
- **GIVEN** TypeScript conversion
- **WHEN** developer views source code
- **THEN** All application code resides in index.ts
- **AND** No additional source files are created

### Requirement: Type Safety
The project SHALL use TypeScript interfaces and type annotations throughout the codebase.

#### Scenario: Type annotations
- **GIVEN** TypeScript source code
- **WHEN** developer examines class properties and methods
- **THEN** All properties have explicit types or inferred types
- **AND** All method parameters and return values are typed
- **AND** Interfaces are defined for complex data structures

### Requirement: Build Process
The project SHALL provide build scripts for TypeScript compilation.

#### Scenario: Build command
- **GIVEN** package.json with build scripts
- **WHEN** developer runs `npm run build`
- **THEN** TypeScript compiler runs
- **AND** Compiled JavaScript is generated
- **AND** Build output is suitable for npm publication

### Requirement: TypeScript Configuration
The project SHALL include tsconfig.json with appropriate compiler options.

#### Scenario: Config file exists
- **GIVEN** project root directory
- **WHEN** developer checks for tsconfig.json
- **THEN** file exists with valid TypeScript configuration
- **AND** Target is set to ES2018 or higher for Node.js compatibility
- **AND** Module resolution is set to node
- **AND** outDir points to dist/ or similar build directory

### Requirement: Type Definitions
The project SHALL provide type definitions for all custom types used in the application.

#### Scenario: Config interface
- **GIVEN** TypeScript source code
- **WHEN** developer examines type definitions
- **THEN** Config interface exists with provider, apiKey, model properties
- **AND** LLM provider interfaces exist for API responses
- **AND** All types are exported for potential future modularization

### Requirement: Documentation Updates
The project SHALL update all documentation to reflect TypeScript adoption.

#### Scenario: AGENTS.md update
- **GIVEN** AGENTS.md file
- **WHEN** developer reads TypeScript guidelines
- **THEN** Code style includes TypeScript patterns
- **AND** Interface definitions are documented
- **AND** Type annotation conventions are explained

#### Scenario: project.md update
- **GIVEN** openspec/project.md file
- **WHEN** developer reads tech stack section
- **THEN** TypeScript is listed as primary language
- **AND** "No TypeScript" constraint is removed
- **AND** Build process includes TypeScript compilation
