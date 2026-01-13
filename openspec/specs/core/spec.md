# core Specification

## Purpose
TBD - created by archiving change convert-to-typescript. Update Purpose after archive.
## Requirements
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
- **AND** Compiled JavaScript is output to dist/ directory with shebang
- **AND** No type errors are reported

### Requirement: Type Safety
The project SHALL use TypeScript interfaces and type annotations throughout the codebase.

#### Scenario: Type annotations
- **GIVEN** TypeScript source code
- **WHEN** developer examines class properties and methods
- **THEN** All properties have explicit types or inferred types
- **AND** All method parameters and return values are typed
- **AND** Interfaces are defined for complex data structures

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

### Requirement: Type Definitions
The project SHALL provide type definitions for all custom types used in the application.

#### Scenario: Config interface
- **GIVEN** TypeScript source code
- **WHEN** developer examines type definitions
- **THEN** Config interface exists with provider, apiKey, model properties
- **AND** LLM provider interfaces exist for API responses
- **AND** All types are exported for potential future modularization

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

### Requirement: Jest Testing Framework
The project SHALL use Jest for automated unit and integration testing to ensure code quality and prevent regressions.

#### Scenario: Jest configuration
- **GIVEN** package.json and project structure
- **WHEN** developer runs `npm install`
- **THEN** Jest and related testing dependencies are installed
- **AND** jest.config.js exists with TypeScript support
- **AND** Test scripts are available in package.json

#### Scenario: Unit test execution
- **GIVEN** test files in __tests__/ directories
- **WHEN** developer runs `npm test`
- **THEN** All unit tests execute successfully
- **AND** Test coverage is reported
- **AND** No test failures occur

#### Scenario: Integration test execution
- **GIVEN** integration test files
- **WHEN** developer runs `npm run test:integration`
- **THEN** End-to-end workflows are tested
- **AND** Mock API responses are used for external dependencies
- **AND** Cross-platform scenarios are covered

### Requirement: Test Coverage
The project SHALL maintain comprehensive test coverage for critical functionality.

#### Scenario: Core module coverage
- **GIVEN** source code in src/ modules
- **WHEN** tests run with coverage
- **THEN** ConfigManager has >90% coverage
- **AND** Provider implementations have >80% coverage
- **AND** CLI interface has >85% coverage

#### Scenario: Test organization
- **GIVEN** test directory structure
- **WHEN** developer examines tests
- **THEN** Unit tests are colocated with source files in __tests__/
- **AND** Integration tests are in separate integration/ directory
- **AND** Test naming follows source file naming conventions

### Requirement: Code Linting with Oxlint
The project SHALL use Oxlint for automated code quality and style checking.

#### Scenario: Oxlint installation
- **GIVEN** package.json devDependencies
- **WHEN** developer runs `npm install`
- **THEN** oxlint is installed as a dev dependency
- **AND** oxlint binary is available for execution

#### Scenario: Linting configuration
- **GIVEN** project root directory
- **WHEN** developer checks for linting config
- **THEN** .oxlintrc.json exists with appropriate rules
- **AND** Rules are configured for TypeScript/JavaScript
- **AND** Rules align with project coding standards

#### Scenario: Linting execution
- **GIVEN** TypeScript source files
- **WHEN** developer runs `npm run lint`
- **THEN** Oxlint scans all source files
- **AND** Reports any linting violations
- **AND** Provides clear error messages and locations

#### Scenario: CI/CD integration
- **GIVEN** package.json scripts
- **WHEN** CI/CD runs `npm test`
- **THEN** Linting is executed before tests
- **AND** Build fails if linting violations exist
- **AND** Linting runs on all supported platforms

### Requirement: Provider Registry Persistence
The system SHALL maintain a persistent registry of configured LLM providers with their credentials.

#### Scenario: Registry file creation
- **GIVEN** user runs first provider registration command
- **WHEN** provider is successfully registered
- **THEN** ~/.cmdgenie/providers.json is created
- **AND** provider credentials are stored securely
- **AND** registry persists across sessions

#### Scenario: Multiple provider support
- **GIVEN** registry supports multiple providers
- **WHEN** user registers additional providers
- **THEN** all providers are stored in registry
- **AND** each provider maintains independent credentials
- **AND** providers can be listed and managed individually

#### Scenario: Registry integrity
- **GIVEN** registry file exists
- **WHEN** application starts
- **THEN** registry is loaded and validated
- **AND** corrupted entries are handled gracefully
- **AND** missing registry triggers setup flow

### Requirement: Provider Management Commands
The CLI SHALL provide commands for managing the provider registry.

#### Scenario: Add provider command
- **GIVEN** user wants to register a new provider
- **WHEN** user runs `--add-provider <type> <name> [options]`
- **THEN** provider is validated and added to registry
- **AND** API key is prompted or provided securely
- **AND** success confirmation is shown

#### Scenario: List providers command
- **GIVEN** providers are registered
- **WHEN** user runs `--list-providers`
- **THEN** all registered providers are displayed
- **AND** active provider is highlighted
- **AND** provider types and names are shown

#### Scenario: Switch active provider
- **GIVEN** multiple providers registered
- **WHEN** user runs `--update-llm <provider-name>`
- **THEN** active provider is switched
- **AND** config.json is updated with active provider reference
- **AND** new provider settings take effect immediately

### Requirement: First-Run Setup Flow
The system SHALL guide users through initial provider setup on first use.

#### Scenario: First run detection
- **GIVEN** no registry file exists
- **WHEN** user attempts command generation
- **THEN** setup flow is triggered
- **AND** user is prompted to add at least one provider
- **AND** command generation is blocked until setup completes

#### Scenario: Migration from single provider
- **GIVEN** existing config.json with single provider
- **WHEN** application detects legacy config
- **THEN** provider is migrated to registry format
- **AND** backward compatibility is maintained
- **AND** user is notified of migration

### Requirement: Ollama Provider Support
The system SHALL support Ollama as a native provider for local LLM inference.

#### Scenario: Ollama provider registration
- **GIVEN** Ollama is running locally on default port
- **WHEN** user configures Ollama as provider
- **THEN** Ollama appears in supported providers list
- **AND** Configuration accepts Ollama model names
- **AND** API calls route to localhost:11434

#### Scenario: Ollama command generation
- **GIVEN** Ollama provider is configured with available model
- **WHEN** user requests command generation
- **THEN** API request is sent to Ollama generate endpoint
- **AND** Response is parsed correctly
- **AND** Generated command follows same cleaning rules

#### Scenario: Ollama error handling
- **GIVEN** Ollama service is not running
- **WHEN** command generation is attempted
- **THEN** connection error is handled gracefully
- **AND** User receives helpful error message
- **AND** Fallback suggestions are provided

### Requirement: Local Model Compatibility
The Ollama provider SHALL work with various local models available through Ollama.

#### Scenario: Model selection
- **GIVEN** user has multiple Ollama models installed
- **WHEN** configuring Ollama provider
- **THEN** any valid Ollama model name is accepted
- **AND** Model availability is not pre-validated at config time
- **AND** Runtime errors handle unavailable models

#### Scenario: Offline operation
- **GIVEN** Ollama provider configured and service running
- **WHEN** user generates commands without internet
- **THEN** commands are generated using local model
- **AND** No external API calls are made
- **AND** Performance depends on local hardware

### Requirement: Custom LLM Provider Support
The system SHALL allow users to register custom LLM providers with their own API endpoints, models, and authentication.

#### Scenario: Custom provider registration
- **GIVEN** user has a compatible LLM API endpoint
- **WHEN** user runs `cmdgenie --add-provider custom <name> --endpoint <url> --model <model> --api-key <key>`
- **THEN** custom provider is stored in provider registry
- **AND** provider is available for selection and command generation
- **AND** configuration persists across sessions

#### Scenario: Custom provider usage
- **GIVEN** custom provider is registered in registry
- **WHEN** user selects custom provider and runs command generation
- **THEN** API calls are made to custom endpoint
- **AND** Custom model and authentication are used
- **AND** Response parsing works with OpenAI-compatible format

#### Scenario: Custom provider validation
- **GIVEN** custom provider registration attempt
- **WHEN** user provides invalid endpoint or missing required fields
- **THEN** validation error is shown
- **AND** Provider is not registered
- **AND** Helpful error message guides user to correct format

### Requirement: Custom Provider Registry Integration
The provider registry SHALL support custom providers alongside built-in providers.

#### Scenario: Registry storage
- **GIVEN** custom provider registration
- **WHEN** provider is added to registry
- **THEN** custom providers are stored in ~/.cmdgenie/providers.json
- **AND** Registry includes custom provider entries with endpoint, model, apiKey
- **AND** Custom providers appear in --list-providers output

#### Scenario: Provider activation
- **GIVEN** custom provider registered in registry
- **WHEN** user runs `--update-llm <custom-provider-name>`
- **THEN** custom provider becomes active
- **AND** Configuration references the selected custom provider
- **AND** Command generation uses custom provider settings

