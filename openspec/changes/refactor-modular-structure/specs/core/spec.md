## MODIFIED Requirements
### Requirement: Tech Stack
The project SHALL use TypeScript for type safety and better development experience with a modular architecture.

#### Scenario: TypeScript setup
- **GIVEN** a fresh project clone
- **WHEN** developer runs `npm install`
- **THEN** TypeScript and @types/node are installed as devDependencies
- **AND** tsconfig.json is present with appropriate configuration

#### Scenario: TypeScript compilation
- **GIVEN** TypeScript source code in src/ directory structure
- **WHEN** developer runs `npm run build`
- **THEN** TypeScript compiles to JavaScript
- **AND** Compiled JavaScript is output to dist/index.js
- **AND** No type errors are reported

## REMOVED Requirements
### Requirement: Single-File Architecture
**Reason**: Refactoring to modular structure for better maintainability and code organization. The single-file constraint is being replaced with a modular architecture.

**Migration**: The codebase will be restructured into src/ directory with separate modules for types, config, providers, and CLI. External CLI interface and behavior remain unchanged.

## ADDED Requirements
### Requirement: Modular Architecture
The project SHALL use a modular directory structure under src/ with logical separation of concerns.

#### Scenario: Directory structure exists
- **GIVEN** the project root directory
- **WHEN** developer views source code
- **THEN** src/ directory exists with the following structure:
- **AND** src/types/ contains type definitions (index.ts, providers.ts)
- **AND** src/config/ contains configuration management (constants.ts, index.ts)
- **AND** src/providers/ contains LLM provider implementations (base.ts, openai.ts, anthropic.ts, google.ts, cohere.ts, registry.ts)
- **AND** src/cli/ contains CLI interface (index.ts)
- **AND** index.ts is the main entry point that exports the public API

#### Scenario: Module dependencies are acyclic
- **GIVEN** the modular source structure
- **WHEN** developer examines module imports
- **THEN** No circular dependencies exist between modules
- **AND** Each module has clear,单向 dependencies

### Requirement: Explicit Access Modifiers
The project SHALL use explicit access modifiers for all classes, interfaces, methods, properties, and constants.

#### Scenario: Public members use PascalCase
- **GIVEN** TypeScript source code
- **WHEN** developer examines public class members
- **THEN** All public methods use PascalCase (e.g., GenerateCommand, LoadConfig, SaveConfig)
- **AND** All public properties use PascalCase (e.g., Config, Provider)
- **AND** All public classes use PascalCase (e.g., CmdGenie, ConfigManager, CLIHandler)
- **AND** All public interfaces use PascalCase (e.g., Config, Provider, ProviderConfig)

#### Scenario: Private members use underscore+pascalCase
- **GIVEN** TypeScript source code
- **WHEN** developer examines private class members
- **THEN** All private methods use underscore+pascalCase (e.g., _callOpenAI, _validateConfig, _cleanResponse)
- **AND** All private properties use underscore+pascalCase (e.g., _config, _providerRegistry)
- **AND** All private classes use underscore+pascalCase (e.g., _InternalHelper)
- **AND** All private interfaces use underscore+pascalCase (e.g., _ProviderResponse)

#### Scenario: Explicit modifiers on all declarations
- **GIVEN** TypeScript source code
- **WHEN** developer examines any type or member declaration
- **THEN** Classes have explicit public or internal modifier
- **AND** Interfaces have explicit public or internal modifier
- **AND** Methods have explicit public or private modifier
- **AND** Properties have explicit public or private modifier
- **AND** Constants have explicit public or private modifier

#### Scenario: Module exports are clear
- **GIVEN** TypeScript module files
- **WHEN** developer examines exports
- **THEN** Public API members are explicitly exported (export public class X)
- **AND** Internal implementation members are not exported
- **AND** Main index.ts acts as barrel export for public API

### Requirement: Naming Conventions
The project SHALL enforce consistent naming conventions for public and private members.

#### Scenario: Public naming convention
- **GIVEN** TypeScript source code
- **WHEN** developer examines public members
- **THEN** Public classes and interfaces use PascalCase
- **AND** Public methods use PascalCase (GenerateCommand, LoadConfig)
- **AND** Public properties use PascalCase
- **AND** Constants use UPPER_SNAKE_CASE (CONFIG_DIR, MAX_TOKENS)

#### Scenario: Private naming convention
- **GIVEN** TypeScript source code
- **WHEN** developer examines private members
- **THEN** Private classes and interfaces use underscore+pascalCase
- **AND** Private methods use underscore+pascalCase (_callOpenAI, _validateConfig)
- **AND** Private properties use underscore+pascalCase (_config, _providerRegistry)

#### Scenario: Consistent across all modules
- **GIVEN** TypeScript source code across all modules
- **WHEN** developer reviews naming in types/, config/, providers/, cli/
- **THEN** Same naming conventions applied consistently
- **AND** No mixing of conventions within or between modules

### Requirement: Type Safety
The project SHALL use TypeScript interfaces and type annotations throughout the codebase with modular organization.

#### Scenario: Type annotations in modules
- **GIVEN** Modular TypeScript source code
- **WHEN** developer examines class properties and methods in any module
- **THEN** All properties have explicit types or inferred types
- **AND** All method parameters and return values are typed
- **AND** Interfaces are defined for complex data structures
- **AND** Types are organized in src/types/ module

#### Scenario: Module interfaces
- **GIVEN** Modular source structure
- **WHEN** developer examines src/types/
- **THEN** Core types exist (Config, ProviderConfig)
- **AND** Provider response types exist as internal (_OpenAIResponse, _AnthropicResponse, etc.)
- **AND** Provider interface exists for common contract (Provider, _ProviderRegistry)

### Requirement: Build Process
The project SHALL provide build scripts for TypeScript compilation from modular source structure.

#### Scenario: Build command
- **GIVEN** package.json with build scripts
- **AND** tsconfig.json configured for src/ directory
- **WHEN** developer runs `npm run build`
- **THEN** TypeScript compiler runs on all modules in src/
- **AND** Compiled JavaScript is generated in dist/ directory
- **AND** Build output is suitable for npm publication
- **AND** No compilation errors occur

#### Scenario: Clean build
- **GIVEN** Previous build artifacts in dist/
- **WHEN** developer runs `npm run clean && npm run build`
- **THEN** dist/ directory is removed
- **AND** Fresh compilation from src/ to dist/ succeeds

### Requirement: TypeScript Configuration
The project SHALL include tsconfig.json with appropriate compiler options for modular structure.

#### Scenario: Config file exists
- **GIVEN** project root directory
- **WHEN** developer checks for tsconfig.json
- **THEN** file exists with valid TypeScript configuration
- **AND** Target is set to ES2018 or higher for Node.js compatibility
- **AND** Module resolution is set to node
- **AND** outDir points to dist/
- **AND** rootDir points to src/
- **AND** include pattern covers src/**/*.ts

### Requirement: Backward Compatibility
The project SHALL maintain backward compatibility of the external CLI interface.

#### Scenario: CLI help unchanged
- **GIVEN** Refactored modular codebase
- **WHEN** user runs `cmdgenie --help`
- **THEN** Help output is identical to pre-refactor version
- **AND** All usage examples remain valid

#### Scenario: LLM update unchanged
- **GIVEN** Refactored modular codebase
- **WHEN** user runs `cmdgenie --update-llm openai <key>`
- **THEN** Configuration is updated identically to pre-refactor version
- **AND** Same error messages and success output

#### Scenario: Command generation unchanged
- **GIVEN** Refactored modular codebase
- **WHEN** user runs `cmdgenie "find all directories"`
- **THEN** Generated command is identical to pre-refactor version
- **AND** Interactive confirmation behaves identically
- **AND** Execution output is identical

### Requirement: Documentation Updates
The project SHALL update all documentation to reflect modular architecture and access modifier conventions.

#### Scenario: AGENTS.md update
- **GIVEN** AGENTS.md file
- **WHEN** developer reads architecture guidelines
- **THEN** Modular directory structure is documented
- **AND** Access modifier guidelines are included
- **AND** Naming conventions (PascalCase public, underscore+pascalCase private) are documented
- **AND** Module organization is explained

#### Scenario: project.md update
- **GIVEN** openspec/project.md file
- **WHEN** developer reads architecture section
- **THEN** Modular architecture is listed instead of single-file
- **AND** "Single-file architecture" constraint is removed
- **AND** src/ directory structure is documented
- **AND** Access modifier and naming conventions are listed

#### Scenario: Import examples
- **GIVEN** AGENTS.md or documentation
- **WHEN** developer reviews code examples
- **THEN** Import examples show modular structure (e.g., `import { CmdGenie } from './cli'`)
- **AND** Public API usage examples are provided
